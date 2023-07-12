export default class Bouq1_5
{
    constructor(scene,cX, cY)
    {
        this.scene=scene;
        this.cX=cX;
        this.cY=cY;
        this.maxNumBals = 6;
        this.numBals = 0;
        this.bouqArray=[-1,-1,-1,-1,-1,-1];

        // изображения серого букета-подложки, ценника и ценника для твина
        this.grBqImg=this.scene.add.image(this.cX, this.cY,"atlas", 'grBq1_5').setOrigin(0.5,0.52);
        this.prImg=this.scene.add.image(this.cX+130, this.cY-130, '30').setOrigin(0.5,0.5);
        //this.tweenPrImg=this.scene.add.image(this.cX+130, this.cY-130, '30').setOrigin(0.5,0.5);

        this.ballGroup=this.scene.add.group();
        for(var i=0;i<6;i++)
	    {
		    this.ballGroup.create(this.cX,this.cY,"atlas", 'empty');
        } 
        
        let spr;
        this.ballGroup.getChildren()[0].setOrigin(0.5,1.27);
        this.ballGroup.getChildren()[1].setOrigin(0.5,1.27).angle=72;
        this.ballGroup.getChildren()[2].setOrigin(0.5,1.27).angle=-72;
        this.ballGroup.getChildren()[3].setOrigin(0.5,1.27).angle=144;
        this.ballGroup.getChildren()[4].setOrigin(0.5,1.27).angle=-144;
        this.ballGroup.getChildren()[5].setOrigin(0.5,0.5);
        //this.ballGroup.getChildren()[2].setOrigin(0.5,1).angle=-144;

        //this.ballGroup.getChildren()[3].setOrigin(0.5,0.54);
        //spr.setOrigin(0.5,1);
        // this.ballGroup.children[0].angle=60;
        // this.ballGroup.children[1].setOrigin(0.5,1);
        // this.ballGroup.children[1].angle=-60;
        // this.ballGroup.children[2].setOrigin(0.5,1);
        // this.ballGroup.children[2].angle=180;
    }

    addGreyBq()
    {
        this.scene.add.image(this.cX, this.cY,"atlas", 'grBq1_5').setOrigin(0.5,0.54);
    }

    // getClrByNum(num)
    // {
    //     switch(num)
    //     {
    //         case 0:
    //             return "#ff0000";
    //         break;
    //         case 1:
    //             return "#00ff00";
    //         break;
    //         case 2:
    //             return "#0000ff";
    //         break;
    //     }
    // }


    // возвращает индекс в букете, по которому можно разместить шар
    // цвета nColor, если добавление невозможно, вернёт -1, массив bouqArray
    // содержит информацию об уже добавленных в букет шарах
    isAdable(nColor)
    {
        if (this.bouqArray[0] == -1) return 0;

        if ((this.bouqArray[1] == -1)&&
                (nColor != this.bouqArray[0])) return 1;

        if(nColor==this.bouqArray[1])
        {
            if (this.bouqArray[2] == -1) return 2;
            if (this.bouqArray[3] == -1) return 3;
            if (this.bouqArray[4] == -1) return 4;
            if (this.bouqArray[5] == -1) return 5;
        }
        return -1;
    }

    addBalloon(numClr)
    {
        let balImgName=this.getImgByNumClr(numClr);
		if(this.numBals==0)
		{
			this.ballGroup.getChildren()[5].setTexture("atlas",balImgName);
		}
		else
		{
			this.ballGroup.getChildren()[this.numBals-1].setTexture("atlas",balImgName);
		}
		this.bouqArray[this.numBals]=numClr;
		this.numBals++;
    }

    getImgByNumClr(numClr)
    {
        switch(numClr){
            case 0:
                if(this.numBals==0) return "cRedBal";
                return "redBal";
            break;
            case 1:
                if(this.numBals==0) return "cGreenBal";
                return "greenBal";
            break;
            case 2:
                if(this.numBals==0) return "cBlueBal";
                return "blueBal";
            break;
            case 3:
                if(this.numBals==0) return "cYellowBal";
                return "yellowBal";
            break;
        }
    }

    isCopleted()
    {
        if (this.bouqArray[5] != -1) return true;
        return false;
    }

    clear()
    {
        for (let i = 0; i < this.bouqArray.length; i++)
        {
            this.bouqArray[i] = -1;
            this.ballGroup.getChildren()[i].setTexture("atlas",'empty');
        }

        this.numBals=0;
    }

    // удаляет со сцены все видимые объекты уровня, в том числе и ценники, 
    // ценники-твины, черно-белое изображение букета-подложки, а также все
    // цветные шары, находящиеся в букете 
    clearAll()
    {
        this.clear();
        this.grBqImg.destroy();
        this.prImg.destroy();
        //this.tweenPrImg.destroy();
    }

    createTween()
    {
        let twObj=this.scene.add.image(this.cX+130, this.cY-130,"atlas", '30').setOrigin(0.5,0.5);
        twObj.setData({x: this.cX+130,y: this.cY-130});
        return twObj;
    }

    returnTweenPr()
    {
        this.tweenPrImg.x=this.cX+130;
        this.tweenPrImg.y=this.cY-130;
        this.tweenPrImg.alpha=1;
    }

    getHelping()
    {
        if((this.bouqArray[0]!=-1)&&(this.bouqArray[1]==-1))
        {
            return "Цвет лепестков должен отличаться от цвета центра!";
        }
        if(this.bouqArray[1]!=-1)
        {
            return "Все лепестки должны быть одного цвета!";
        }
    }
}