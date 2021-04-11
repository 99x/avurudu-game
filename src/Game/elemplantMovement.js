class Elephant {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }
    animate (canvas)  {         
        if (this.x < canvas.width-200 && this.direction === 'leftToRight' ) {
            this.x += 8;
            if(this.x === canvas.width-200){
                this.direction = "rightToLeft";
            }
        }else{
            this.x -= 8;
            if(this.x === 0){
                this.direction = 'leftToRight';
            }
        }                 
    }
}
