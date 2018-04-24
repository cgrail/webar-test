sap.ui.core.Control.extend("webar-test.control.ArView", {
    metadata : {
        properties : {
            "name" : "string"
        }
    },

    renderer : function(oRm, oControl) {      // the part creating the HTML
          oRm.write("<div");
          oRm.writeControlData(oControl);
          oRm.addClass("ar-view");
          oRm.writeClasses();
          oRm.write('>');
          oRm.write("</div>");
    }
});