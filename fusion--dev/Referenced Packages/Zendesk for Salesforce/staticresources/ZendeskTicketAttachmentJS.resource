var ZendeskTicketAttachmentModule = {};
(function(zdContext){
	var tokenContainerId;
	var singleDeleteMethod;
	var multiDeleteMethod;
	var zendeskLoaderImgURL;
	var uploadFileDisplay;
	var uploadFileDisplayId;

	var uploadLimits = {
		//MAX_FILE_SIZE : 4350000
		MAX_FILE_SIZE : 5000000,//5MB
		MAX_STRING_SIZE: 6000000
	}
	var errorMsg = {
		MAX_FILE_SIZE: 'Exceeds file size limit!',
		MAX_STRING_SIZE: 'Exceeds heap size limit!',
		MAX_FILE_COUNT: 'Exceeds number of files. You can only select a maximum of 50 files.'
	}
	var removeButtonCache = [];
	var prefixes = {
		WRAP: '_wrap',
		LOAD_IMG: '_loadImg',
		REMOVE_BTN: '_rmBtn'
	};
	var globalSelectedFiles = 0;
	var fileInputHTMLField;

	zdContext.init = function(
		singleDeleteRemoteAction,
		multiDeleteRemoteAction,
		imgLoaderURL,
		uploadFileDisplayFiledId
	) {
		singleDeleteMethod = singleDeleteRemoteAction;
		multiDeleteMethod = multiDeleteRemoteAction;
		zendeskLoaderImgURL = imgLoaderURL;
		uploadFileDisplayId = uploadFileDisplayFiledId;
		createFileInputElement();
		window.onbeforeunload = deleteUnprocessedFiles;
	};

	zdContext.selectFile = function(tokenContainerFieldId) {
		tokenContainerId = tokenContainerFieldId;
		fileInputHTMLField.onchange = function() {
			onFileSelected(this, uploadFileDisplayId, tokenContainerId);
			return false;
		};
		fileInputHTMLField.click();
		return false;
	}
	
	function createFileInputElement() {
		var fileInput = document.createElement('input');
		fileInput.style.visibility = 'hidden';
		fileInput.type = 'file';
		fileInput.multiple = true;
		document.body.appendChild(fileInput);
		fileInputHTMLField = fileInput;
	}

	function getUniqueTokens(){
		var cleanedUpload = [];
		if (removeButtonCache.length > 0) {
			for (var i = 0; i < removeButtonCache.length; i++) {
				var temp = removeButtonCache[i].token;
				if(temp){
					var isUnique = true;
					for (var j = 0; j < cleanedUpload.length; j++) {
						var currentAvailable = cleanedUpload[j];
						if (currentAvailable == temp) {
							//current token already is already inside cleanedUpload array
							//no more processing needs to happen
							isUnique = false;
							break;
						}
						//add the token to cleanedUpload array
						//this means it is a unique token
					}
					if (isUnique) {
						cleanedUpload.push(temp);
					}
				}
			}
		}
		return cleanedUpload;
	}
	//delete uploaded files when closing window
	function deleteUnprocessedFiles(){
		if(!isSubmitForm && removeButtonCache.length > 0){
			var cleanedUpload = getUniqueTokens();

			if(cleanedUpload != null && cleanedUpload.length > 0){
			//no return processing required
			Visualforce.remoting.Manager.invokeAction(
				multiDeleteMethod,
				cleanedUpload,
				function(result, evt) {}
			);
			}
		}
	}
	function onFileSelected(attachmentInput, outputId, tokenContainerID){
		var uploadFileDisplay = getById(outputId);
		var selectedFiles = attachmentInput.files;
		var randNum = getRandID();
		var tokenContainer = getById(tokenContainerID);

		var potentialNumberOfFiles = globalSelectedFiles + selectedFiles.length;
		if (potentialNumberOfFiles > 50) {
			alert(errorMsg.MAX_FILE_COUNT + '\nTotal files selected: ' + potentialNumberOfFiles);
		} else {
			globalSelectedFiles += selectedFiles.length;
			for (var i = 0; i < selectedFiles.length; i++) {
				var selectedFileID = randNum + '_' + i;
				var selectedFile = selectedFiles[i];
				var reader = new FileReader();
				reader.uploadFileDisplay = uploadFileDisplay;
				reader.usedID = selectedFileID;
				reader.fileObj = selectedFile;
				reader.onload = handleUpload;
				reader.tokenContainer = tokenContainer;
				uploadFileDisplay.innerHTML += getUploadDisplay(selectedFileID, selectedFile.name);
				if (selectedFile.size > uploadLimits.MAX_FILE_SIZE) {
					addErrorRemoveButton(selectedFileID, errorMsg.MAX_FILE_SIZE, selectedFile.name);
				} else {
					reader.readAsBinaryString(selectedFile);
				}
			}
		}
		attachmentInput.value = null;//clear input
	}
	function handleUpload() {
		var targetReader = this;
		var targetID = targetReader.usedID;
		var fileBody = window.btoa(targetReader.result);
		if (fileBody.length > uploadLimits.MAX_STRING_SIZE) {
			addErrorRemoveButton(targetID, errorMsg.MAX_STRING_SIZE);
		} else {
			uploadFile(targetReader, fileBody);
		}
	}
	function getNamespace() {
		return window.Zendesk ? 'Zendesk.' : '';
	}
	function uploadFile(targetReader, fileBody) {
		var targetID = targetReader.usedID;

		var param = {
			fileName: targetReader.fileObj.name,
			type: targetReader.fileObj.type,
			bodyRaw: fileBody
		};
		sforce.apex.execute(getNamespace()+'ZendeskPublicServices','uploadToZendesk', param, function(result) {
			//process upload response
			var display = getById(targetID);
			try {
				if (result) {
					var resultJSON = JSON.parse(result);

					if (resultJSON.error) {
						throw resultJSON.error;
					} else {
						//adding token to the input file that will be attached to the ticket
						var token = resultJSON.upload.token;
						var currentTokens = targetReader.tokenContainer.value;
						if (currentTokens == null || currentTokens == '') {
							currentTokens = token;
						}else{
							currentTokens += ','+token;
						}
						targetReader.tokenContainer.value = currentTokens;
						//display local uploaded file
						var urlObj = window.URL.createObjectURL(targetReader.fileObj);
						var downloader = document.createElement('a');
						downloader.href = urlObj;
						var typeToCheck = targetReader.fileObj.type.toLocaleLowerCase();
						//display images and text files in new tab, else download other files
						if (typeToCheck.startsWith('image/')) {
							downloader.target = "_blank";
						} else {
							downloader.download = targetReader.fileObj.name;
						}
						downloader.innerHTML = targetReader.fileObj.name;
						display.innerHTML = '';
						display.appendChild(downloader);
						addUploadedRemoveButton(targetReader, token);
						prepareRemoveButtons();
					}
				} else {
					display.innerHTML = 'Failed';
				}
			} catch(e) {
				display.innerHTML = 'Failed to upload ' + param.fileName;
				updateImgLoader(targetID, getErrorMsg(e));
			}
		});
	}
	function addUploadedRemoveButton(targetReader,uploadToken) {
		try{
			//remove loading img and add remove button
			var targetID = targetReader.usedID;
			updateImgLoader(targetID, getRemoveBtn(targetID));

			removeButtonCache.push({
				id: targetID,
				name: targetReader.fileObj.name,
				token: uploadToken,
				tokenContainerID: targetReader.tokenContainer.id
			});
		}catch(e){
			throw '\naddUploadedRemoveButton error: ' + e;
		}
	}
	function addErrorRemoveButton(targetID, msg, name) {
		updateImgLoader(targetID, getRemoveBtn(targetID) + getErrorMsg(msg));
		removeButtonCache.push({
			id: targetID,
			name: name,
			token: null,
			tokenContainerID: null
		});
		prepareRemoveButtons();
	}
	function prepareRemoveButtons() {
		for (var i = 0; i < removeButtonCache.length; i++) {
			var btnCache = removeButtonCache[i];
			var btnObj = getById(getRmBtnId(btnCache.id));
			if (btnObj) {
				btnObj.uploadInfo = btnCache;
				btnObj.onclick = onRemoveButtonClick;
			}
		}
	}
	function onRemoveButtonClick() {
		if (this.innerHTML == 'x') {//only handle attachment removal when it's a remove button
			var info = this.uploadInfo;
			var deletePropmptMsg = "Are you sure you want to remove "+info.name+"?";
			if (info.token != null && info.name != null) {//for removing uploaded file
				if (confirm(deletePropmptMsg)) {
					deleteFileOnZendesk(info);
					var tokenContainer = getById(info.tokenContainerID);
					//remove token from token text field
					var tokens = tokenContainer.value.split(',');
					var newTokens = '';
					for (var i = 0; i < tokens.length; i++) {
						if (tokens[i] != '' && tokens[i] != info.token) {
							newTokens += tokens[i] + ',';
						}
					}
					tokenContainer.value = newTokens;
				}
			} else {
				if (confirm(deletePropmptMsg)) {
					getById(getWrapId(info.id)).innerHTML = '';
				}
			}
			removeFromButtonCache(info.id);
			globalSelectedFiles--;//to monitor how many uploaded files are currently in view
		}
	}
	function removeFromButtonCache(targetID) {
		for (var i = removeButtonCache.length - 1; i >= 0; i--) {
			if (removeButtonCache[i].id == targetID) {
				removeButtonCache.splice(i,1);//remove the current button clicked on the cache
				break;//if button is found and removed end process
			}
		}
	}
	function deleteFileOnZendesk(info) {
		updateImgLoader(info.id, getImgLoader(info.id));
		Visualforce.remoting.Manager.invokeAction(singleDeleteMethod, info.token, function(result, evt) {
			var hasError = false;
			if (result != null && result != '') {
				if (result == 204) {//response body of successfull deletion
					alert(info.name + ' has been deleted.');
					getById(getWrapId(info.id)).innerHTML = '';
				} else {
					hasError = true;
				}
			} else {
				hasError = true;
			}
			if (hasError) {
				updateImgLoader(info.id, getErrorMsg('Deletion of ' + info.name + ' failed. ' + result));
			}
		});
	}
	function getErrorMsg(msg) {
		return '<span class="msgError">'+msg+'</span>';
	}
	function getRemoveBtn(targetID) {
		var removeID = getRmBtnId(targetID);
		return '<div class="xBtn" id="'+removeID+'">x</div>';
	}
	function getUploadDisplay(tempID, label) {
		return '<span id="'+getWrapId(tempID)+'"><br/><div class="fileSelected" id="'+tempID+'">'+label+'</div>'+getImgLoader(tempID)+'<br/></span>'
	}
	function getRandID() {
		var timestamp = new Date().getTime();
		return 'zend_'+timestamp;
	}
	function updateImgLoader(targetID, str) {
		if (str) {
			getById(getLoaderId(targetID)).innerHTML = str;
		}
	}
	function getWrapId(id) {
		return id+prefixes.WRAP;
	}
	function getRmBtnId(id)	{
		return id+prefixes.REMOVE_BTN;
	}
	function getLoaderId(id) {
		return id+prefixes.LOAD_IMG;
	}
	function getImgLoader(id) {
	var idProperty = id ? "id='"+getLoaderId(id)+"'" : "";
		return "<span "+idProperty+"><img class='loadingImg' src='"+zendeskLoaderImgURL+"' /></span>";
	}
	function getById(id) {
		return document.getElementById(id);
	}
})(ZendeskTicketAttachmentModule);
