// класс-букет из одного центра и четырёх лепестков -
// два лепестка одного цвета отличающихся цветом от центра и
// два лепестка другого цвета, отличного от цвета центра
export default class Bouq1_2_2
{
    constructor(scene,cX, cY)
    {
        this.scene=scene;
        this.cX=cX;
        this.cY=cY;
        this.maxNumBals = 5;
        this.numBals = 0;
        this.bouqArray=[-1,-1,-1,-1,-1];

        // изображения серого букета-подложки, ценника и ценника для твина
        this.grBqImg=this.scene.add.image(this.cX, this.cY,"atlas", 'grBq1_2_2').setOrigin(0.5,0.5);
        this.prImg=this.scene.add.image(this.cX+130, this.cY-130,"atlas", '25').setOrigin(0.5,0.5);
        //this.tweenPrImg=this.scene.add.image(this.cX+130, this.cY-130, '25').setOrigin(0.5,0.5);

        this.ballGroup=this.scene.add.group();
        for(var i=0;i<5;i++)
	    {
		    this.ballGroup.create(this.cX,this.cY,"atlas",'empty');
        } 
        
        let spr;
        this.ballGroup.getChildren()[0].setOrigin(0.5,1.1);
        this.ballGroup.getChildren()[1].setOrigin(0.5,1.1).angle=180;
        this.ballGroup.getChildren()[2].setOrigin(0.5,1.1).angle=-90;
        this.ballGroup.getChildren()[3].setOrigin(0.5,1.1).angle=90;
        this.ballGroup.getChildren()[4].setOrigin(0.5,0.5);
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

    // возвращает индекс в букете, по которому можно разместить шар
    // цвета nColor, если добавление невозможно, вернёт -1, массив bouqArray
    // содержит информацию об уже добавленных в букет шарах, цвета в
    // bouqArray[0] одного цвета, в bouqArray[1] и bouqArray[2] другого цвета,
    // а в bouqArray[3] и bouqArray[4] - третьего цвета
    isAdable(nColor)
    {
        if (this.bouqArray[0] == -1) return 0;
        if ((this.bouqArray[0] != -1) && (this.bouqArray[1] == -1)&&
            (nColor != this.bouqArray[0])) return 1;
        if ((this.bouqArray[0] != -1) && (this.bouqArray[1] != -1))
        {
            if(this.bouqArray[2] == -1)
            {
                if((nColor != this.bouqArray[0])
                    && (nColor == this.bouqArray[1])) return 2;
                if((this.bouqArray[3] == -1)&&(nColor != this.bouqArray[0])&&
                    (nColor != this.bouqArray[1])) return 3;
                if((this.bouqArray[3] != -1)&&(this.bouqArray[4] == -1)&&
                    (nColor == this.bouqArray[3])) return 4;
            }

            if((this.bouqArray[2] != -1)&&(nColor != this.bouqArray[0])
              && (nColor != this.bouqArray[1]))
            {
                if(this.bouqArray[3]==-1) return 3;
                if((this.bouqArray[3]!=-1)&&(this.bouqArray[4]==-1)&&
                    (nColor == this.bouqArray[3])) return 4;
            }
        }
        return -1;
    }

    addBalloon(numClr)
    {
        //let ret=this.isAdable(nColor);
        let balImgName=this.getImgByNumClr(numClr);
		if(this.numBals==0)
		{
            this.ballGroup.getChildren()[4].setTexture("atlas", balImgName);
            this.bouqArray[0]=numClr;
            this.numBals++;
            return 0;
		}
       
        if(numClr==this.bouqArray[0]) return -1;

        if(this.numBals==1)
        {
            this.ballGroup.getChildren()[0].setTexture("atlas", balImgName);
            this.bouqArray[1]=numClr;
            this.numBals++;
            return 1;
        }
        if(this.numBals==2)
        {
            if(this.bouqArray[1]==numClr)
            {
                this.ballGroup.getChildren()[1].setTexture("atlas", balImgName);
                this.bouqArray[2]=numClr;
                this.numBals++;
                return 2;
            }
            else
            {
                this.ballGroup.getChildren()[2].setTexture("atlas", balImgName);
                this.bouqArray[3]=numClr;
                this.numBals++;
                return 3;
            }
        }
        // дописать код
        if(this.numBals==3)
        {
            // для случая this.bouqArray[]=[x,y,-1,z,-1]
            if(this.bouqArray[2]==-1)
            {
                if(this.bouqArray[1]==numClr)
                {
                    this.ballGroup.getChildren()[1].setTexture("atlas", balImgName);
                    this.bouqArray[2]=numClr;
                    this.numBals++;
                    return 2;
                }
                if(this.bouqArray[3]==numClr)
                {
                    this.ballGroup.getChildren()[3].setTexture("atlas", balImgName);
                    this.bouqArray[4]=numClr;
                    this.numBals++;
                    return 4;
                }
            }
            // для случая this.bouqArray[]=[x,y,y,-1,-1]
            else
            {
                if(this.bouqArray[1]!=numClr)
                {
                    this.ballGroup.getChildren()[2].setTexture("atlas", balImgName);
                    this.bouqArray[3]=numClr;
                    this.numBals++;
                    return 3;
                }
            }
        }

        // для случая this.bouqArray[]=[x,y,y,z,-1] или [x,y,-1,z,z]
        if(this.numBals==4)
        {
            if((this.bouqArray[2]==-1)&&(numClr==this.bouqArray[1]))
            {
                this.ballGroup.getChildren()[1].setTexture("atlas", balImgName);
                this.bouqArray[2]=numClr;
                this.numBals++;
                return 2;
            }
            if((this.bouqArray[4]==-1)&&(numClr==this.bouqArray[3]))
            {
                this.ballGroup.getChildren()[3].setTexture("atlas", balImgName);
                this.bouqArray[4]=numClr;
                this.numBals++;
                return 4;
            }
        }

        return -1;
    }

    isCopleted()
    {
        if (this.numBals==this.maxNumBals) return true;
        return false;
    }

    clear()
    {
        for (let i = 0; i < this.bouqArray.length; i++)
        {
            this.bouqArray[i] = -1;
            this.ballGroup.getChildren()[i].setTexture("atlas", 'empty');
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
        let twObj=this.scene.add.image(this.cX+130, this.cY-130,"atlas", '25').setOrigin(0.5,0.5);
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
            return "Лепесток не подходит по цвету!";
        }
    }
}