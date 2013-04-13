// {
// basic panel
run_distort(this);

 function run_distort(thisObj){

// this is global
distort_data =  {
    'x':5,
    'y':5
};


///   THIS WILL CHECK IF PANEL IS DOCKABLE OR FLAOTING WINDOW  
var win   = buildUI(thisObj );
if ((win !== null) && (win instanceof Window)) {
    win.center();
    win.show();
} // end if win  null and not a instance of window 

 function buildUI (thisObj  ) {
    var win = (thisObj instanceof Panel) ? thisObj :  new Window('palette', 'shape-distorter',[0,0,150,260],{resizeable: true});

    if (win !== null) {

        var H = 25; // the height
        var W = 30; // the width
        var G = 5; // the gutter
        var x = G;
        var y = G;

        // win.check_box = win.add('checkbox',[x,y,x+W*2,y + H],'check');
        // win.check_box.value = metaObject.setting1;
        win.doit_button = win.add('button', [x ,y,x+W*3,y + H], 'do it');
        // win.up_button = win.add('button', [x + W*5+ G,y,x + W*6,y + H], 'Up'); 

        // win.check_box.onClick = function (){
        //     alert("check");
        // };
        win.doit_button.onClick = function () {
            distort();
      };

    }
    return win;
}


function distort(){
// "in function main. From here on it is a straight run"
// 
            var curComp = app.project.activeItem;
   if (!curComp || !(curComp instanceof CompItem)){
        alert('please select a comp');
        return;
    }

    if(curComp.selectedProperties.length < 1){
        alert('Please select one Path');
    return;
        }
    app.beginUndoGroup('distort');

    var props = curComp.selectedProperties;
        if(props.length > 0){
            var path = props[0].property("ADBE Vector Shape");
            if(path.value instanceof Shape){
                var orig_shape = path.value;
                var orig_verts = orig_shape.vertices;
                var new_verts = [];

                for(var i =0; i < orig_verts.length;i++){
                    var x_plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                    var y_plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                    new_verts.push([orig_verts[i][0] + (distort_data.x * x_plusOrMinus),orig_verts[i][1]+ (distort_data.y * y_plusOrMinus)]);
                    var distorted_shape = new Shape();
                    distorted_shape.vertices = new_verts;
                    distorted_shape.closed = orig_shape.closed;
                    if(!path.isTimeVarying){

                    path.setValue(distorted_shape);
                    }else{
                    path.setValueAtTime(curComp.time, distorted_shape);
                    }


                }
                // alert(orig_verts.toString() + '\n' + new_verts.toString());
            }
        }

       app.endUndoGroup();
    }
 }// close run_distort

// }