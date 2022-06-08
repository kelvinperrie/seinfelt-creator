
var Editor = function() {
    var self = this;

    self.dragStartEvent = null; // the event raised when a drag starts, so we can keep track of where the user clicked on the element
    self.dragged = null;        // the element being dragged
    self.createdImages = 0;

    self.setBackground = function(backgroundImage, event) {
        var source = $(backgroundImage).attr('src');
        console.log(source);
        document.getElementById('drawing-area').style.backgroundImage="url(" + source + ")";
    };

    self.addNewImage = function(imageToAdd, event) {
        console.log(imageToAdd);

        var newImage = imageToAdd.cloneNode(true);

        console.log(event);
        $(newImage).addClass("draggable");
        $(newImage).removeClass("addable-image");
        $(newImage).attr("draggable", true);
        $(newImage).css("z-index", 200);

        $(newImage).on("dragstart", function(event) {
            self.handleDragStart(event);
        });
        $(newImage).on("click", function(event) {
            self.handleClick(event);
        });

        self.createdImages++;
        $(newImage).attr("id", $(newImage).attr("id") + '-' + self.createdImages);


        document.getElementById("drawing-area").appendChild(newImage);
    }

    self.handleClick = function(event) {
        if($(event.target).hasClass("selected")) {
            $(event.target).removeClass("selected");
        } else {
            // stop any existing things being selected
            $(".draggable").removeClass("selected");
            $(event.target).addClass("selected");
        }
        event.stopPropagation();
    }

    self.handleDrop = function(event) {
        console.log("handleDrop")
        event.preventDefault();

        // only do if we're looking at the drop zone (i.e. may be dropped on a child node and the event then bubbles up)
        if($(event.currentTarget).attr("id")=="drawing-area") {
            let dropMe = null;
                
            dropMe = self.dragged;
            
            // if the object is dropped on a child node then the current target and the target are different and we need to 
            // include the child's position when working out the new co-ordinates
            let x = event.offsetX - self.dragStartEvent.offsetX + (event.currentTarget == event.target ? 0 : event.target.offsetLeft);
            let y = event.offsetY - self.dragStartEvent.offsetY + (event.currentTarget == event.target ? 0 : event.target.offsetTop);
            $(dropMe).css( { "position" : "absolute", left : x, top: y });
        }
    };
    self.handleDragStart = function(event) {
        console.log("handleDragStart")
        self.dragStartEvent = event;
        self.dragged = event.target;
        console.log(event.target)
    };

    self.SelectNone = function() {
        $(".selected").removeClass("selected");
    }
    self.DeleteSelected = function() {
        $('.selected').remove();
        //self.UpdateToolBarButtonEnablednesssss();
    }
    self.MoveTowardsFront = function() {
        var currentZ = $('.selected').css("z-index");
        currentZ = parseInt(currentZ) + 10;
        $('.selected').css('z-index', currentZ);
    }
    self.MoveTowardsBack = function() {
        console.log("move back")
        var currentZ = $('.selected').css("z-index");
        console.log(currentZ)
        currentZ = parseInt(currentZ) - 10;
        $('.selected').css('z-index', currentZ);
    }
    self.FlipHorizontal = function() {
        var currentTransform = $('.selected').css("transform");
        var newTransform = "matrix(-1, 0, 0, 1, 0, 0)";
        if(currentTransform == newTransform) {
            newTransform = "matrix(1, 0, 0, 1, 0, 0)";
        }
        $('.selected').css("transform", newTransform);
    }
    self.MakeSmaller = function() {
        var imgWidth = $('.selected').width();
        imgWidth = imgWidth * .9;
        $('.selected').width(imgWidth);
    }
    self.MakeBigger = function() {
        var imgWidth = $('.selected').width();
        imgWidth = imgWidth * 1.1;
        $('.selected').width(imgWidth);
    }

    
    self.initialize = function() {
        console.log("doing setup")
        $("#drawing-area").on("dragover", function(event) {
            console.log("dragover")
            event.preventDefault();  // for some reason we have to do this to make drag & drop work???
        });
        $("#drawing-area").on("drop", function(event) {
            self.handleDrop(event)
        });
        $(".draggable").on("dragstart", function(event) {
            self.handleDragStart(event);
        });
        $(".addable-image").on("click", function(event) {
            self.addNewImage(this, event);
        });
        $(".background-image").on("click", function(event) {
            self.setBackground(this, event);
        });
        $("#drawing-area").on("click", function(event) {
            self.SelectNone();
        })

        // tool bar actions
        $("#move-forwards-button").on("click", function() {
            self.MoveTowardsFront();
        });
        $("#move-backwards-button").on("click", function() {
            self.MoveTowardsBack();
        });
        $("#delete-button").on("click", function() {
            self.DeleteSelected();
        });
        $("#flip-on-horizontal-button").on("click", function() {
            self.FlipHorizontal();
        });
        $("#make-smaller-button").on("click", function() {
            self.MakeSmaller();
        });
        $("#make-bigger-button").on("click", function() {
            self.MakeBigger();
        });
    };
    self.initialize();
}
var editor = Editor();