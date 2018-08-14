({
	helperMethod : function(component, event) {
	//component.find("overlayLib").notifyClose();	
	//component.destroy();
	var popup = window.open(location, '_self', '');
    popup.close();
	}
})