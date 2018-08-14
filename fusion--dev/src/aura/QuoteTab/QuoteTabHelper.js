({
	showsection: function(component, event) {
        var tar = event.getSource();
        var section = component.find('sectionId');
        var content = component.find('accordion-details-01');
        if (tar.get("v.iconName") == "utility:down") {
            var tart = tar.set("v.iconName", 'utility:right');
            $A.util.removeClass(section, 'slds-is-open');
            content.set("v.aria-hidden", "false");
        } else {
            tar.set("v.iconName", 'utility:down');
            $A.util.addClass(section, 'slds-is-open');
            content.set("v.aria-hidden", "true");
        }
    },

    showsectioncustom: function(component, event) {
        var tar1 = event.getSource();
        var section2 = component.find('section2Id');
        var content2 = component.find('accordion-details-02');
        if (tar1.get("v.iconName") == "utility:down") {
            var tart1 = tar1.set("v.iconName", 'utility:right');
            $A.util.removeClass(section2, 'slds-is-open');
            content2.set("v.aria-hidden", "false");
        } else {
            tar1.set("v.iconName", 'utility:down');
            $A.util.addClass(section2, 'slds-is-open');
            content2.set("v.aria-hidden", "true");
        }
    },

    showsectionnoncustom: function(component, event) {
        var tar2 = event.getSource();
        var section3 = component.find('section3Id');
        var content3 = component.find('accordion-details-03');
        if (tar2.get("v.iconName") == "utility:down") {
            var tart2 = tar2.set("v.iconName", 'utility:right');
            $A.util.removeClass(section3, 'slds-is-open');
            content3.set("v.aria-hidden", "false");
        } else {
            tar2.set("v.iconName", 'utility:down');
            $A.util.addClass(section3, 'slds-is-open');
            content3.set("v.aria-hidden", "true");
        }
    },

})