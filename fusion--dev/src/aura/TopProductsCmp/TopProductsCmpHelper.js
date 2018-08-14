({
   toggleHelper : function(component,event) {
    console.log('test');
    var toggleText = component.find("tooltip");
       console.log('test'+toggleText);
        $A.util.toggleClass(toggleText, "toggle");
       /*$A.util.removeClass(toggleText, 'toggle');
       $A.util.addClass(toggleText, 'disOnHover');

    //$A.util.toggleClass(toggleText, "toggle");*/
   },
    toggleHelperRemove : function(component,event) {
    var toggleText = component.find("tooltip");
        $A.util.removeClass(toggleText, 'disOnHover');
       $A.util.addClass(toggleText, 'disOutHover');

    //$A.util.toggleClass(toggleText, "toggle");
   }
})