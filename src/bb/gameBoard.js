import Bouq1_2_2 from './bouq1_2_2.js';
import Bouq1_3 from './bouq1_3.js';
import Bouq1_4 from './bouq1_4.js';
import Bouq1_5 from './bouq1_5.js';
export default class GameBoard
{
    constructor(scene)
    {
        // номер уровня, выбранного игроком и индикатор this.withHelper - если
        // true, то игру необходимо сопровождать подсказками
        this.currentLvl=0;
        this.withHelper=true;
        // баланс - это количество баллов, набранных на текущем уровне
        this.balance=0;
        this.balanceTxt='';
        // суммарный баланс - результат всей игры
        this.sumBalance=0;
        this.sumBalanceTxt='';
        // количество оставшихся в хранилище шаров и текст, это количество выводящий
        this.remBals=0;
        this.remBalsTxt=''; 
        // текст - количество оставшихся шаров, которые выводятся наверху
        this.bigRemBalsTxt=null;

        // текст - количество баллов, необходимых для получения бонуса
        this.ballsForBonusTxt=null;

        this.bqL=null;
        this.bqC=null;
        this.bqR=null;
        this.zoneL=null;
        this.zoneC=null;
        this.zoneR=null;
        this.baloonGroup=null;

        

        // массив, в котором хранятся ходы игрока
        this.movesArr=[];

        // картинки(Image) для ценников-твинов
        this.tweenImage=null;
        this.tweenImageC=null;
        this.tweenImageR=null;

        // когда начинает выполняться твин и затем колбэк, то this.isTween
        // устанавливается =true и все щелчки на букетах в обработчике zoneDownHandler 
        // игнорируются чтобы предотвратить одновременный доступ к данным
        this.isTween=false;

        // окно с подсказками для новичков
        this.helperWnd=null;;

        this.lvlInfoWnd=null;

        // текст, выодяшийся в окне this.helperWnd
        this.txtObj='';

        // массив с кусочком (одним периодом) последовательности цветов в хранилище,
        // на основе его создаётся хранилище - массив this.balloonSetArr
        this.sampleArr=[];
        this.balloonSetArr=[];
        
        this.description=
        {
            'b1_2':"Букет с центром одного цвета и двумя одинаковыми лепестками другого цвета.",
            'b1_3':"Букет с центром одного цвета и тремя одинаковыми лепестками другого цвета.",
            'b1_4':"Букет с центром одного цвета и четырьмя одинаковыми лепестками другого цвета."
        };

        this.scene=scene;
        let bgImd=scene.game.textures.get('bg');
        bgImd=scene.game.textures.list.atlas;
        let bgImg=window.baseCache.get("bg");

        this.scene.add.image(550,350,"atlas",'bg');
        this.scene.add.image(204, 414,'atlas','bgBouq');
  		this.scene.add.image(554, 414,'atlas','bgBouq');
        this.scene.add.image(904, 414,'atlas','bgBouq');

        // интерактивные зоны над областями с букетами
        this.zoneL=this.scene.add.zone(204, 414,340,340).setName('L').disableInteractive();
        this.zoneC=this.scene.add.zone(554, 414,340,340).setName('C').disableInteractive();
        this.zoneR=this.scene.add.zone(904, 414,340,340).setName('R').disableInteractive();
        
        // плашка с надписью "Рекорд", заменившая "Лидер уровня", на которой будет
        // выводиться рекорд уровня, при достижении или улучшении которого, будет
        // даваться бонус - результат умножается на два 
        //this.scene.add.image(234,68,"atlas",'bonusImg');

        // подложка с сообщением о количестве баллов, необходимых для
        // получения бонуса
        this.scene.add.image(234,112,"atlas",'bonusImg');

        // картинка-сообщение, извещающее о получении бонуса и
        // картинка-ценник бонуса
        this.isBonusImg = this.scene.add.image(234,112,"atlas",'empty');
        this.bonusPrice = this.scene.add.image(420,82,"atlas",'empty');

        // подложка с надписью "Всего" для размещения на ней числа набранных баллов
        // за всю игру
        this.scene.add.image(862, 155,"atlas", 'sumBalls').setVisible(true);

        // подложка с надписью "Баланс" для размещения на ней числа набранных баллов
        // за данный уровень
        this.scene.add.image(862, 68,"atlas", 'balance').setVisible(true);

        this.counterBg = this.scene.add.image(545, 125,"atlas", 'empty');


        
        // указатель (номер в массиве) шара - первоочередного кандидата на добавление

        this.lGrBq=this.scene.add.image(204, 414,"atlas", 'empty');
        this.cGrBq=this.scene.add.image(554, 414,"atlas", 'empty');
        this.rGrBq=this.scene.add.image(904, 414,"atlas", 'empty');

        this.clrSeq=this.scene.add.image(554, 614,"atlas", 'empty');

        // утверждены уровни 1 - 10
        this.levelsArr=[];
        this.levelsArr[1]={clr:'clr012012',L:'grBq1_3',C:'grBq1_3',R:'grBq1_3',
            prL:20,prC:20,prR:20,numBal:24};
        this.levelsArr[2]={clr:'clr012012',L:'grBq1_3',C:'grBq1_5',R:'grBq1_3',
            prL:20,prC:30,prR:20,numBal:36};
        this.levelsArr[3]={clr:'clr012012',L:'grBq1_3',C:'grBq1_2_2',R:'grBq1_3',
            prL:20,prC:25,prR:20,numBal:36};
        this.levelsArr[4]={clr:'clr012012',L:'grBq1_2_2',C:'grBq1_4',R:'grBq1_5',
            prL:25,prC:25,prR:30,numBal:36};
        this.levelsArr[5]={clr:'clr012012',L:'grBq1_5',C:'grBq1_4',R:'grBq1_5',
            prL:30,prC:25,prR:30,numBal:39};
        this.levelsArr[6]={clr:'clr012012',L:'grBq1_3',C:'grBq1_4',R:'grBq1_3',
            prL:20,prC:25,prR:20,numBal:42};
            
        // this.levelsArr[6]={clr:'clr011222',L:'grBq1_4',C:'grBq1_3',R:'grBq1_4',
        //     prL:25,prC:20,prR:25,numBal:54};
        this.levelsArr[7]={clr:'clr001122',L:'grBq1_2_2',C:'grBq1_3',R:'grBq1_4',
            prL:25,prC:20,prR:25,numBal:18};
        this.levelsArr[8]={clr:'clr001122',L:'grBq1_3',C:'grBq1_4',R:'grBq1_5',
            prL:20,prC:25,prR:30,numBal:24};
        this.levelsArr[9]={clr:'clr001122',L:'grBq1_4',C:'grBq1_2_2',R:'grBq1_4',
            prL:25,prC:25,prR:25,numBal:30};
        this.levelsArr[10]={clr:'clr001122',L:'grBq1_4',C:'grBq1_4',R:'grBq1_4',
            prL:25,prC:25,prR:25,numBal:30};


        // нулевой элемент levelsArr содержит массив с описанием уровней, нулевой элемент
        // этого вложенного массива зарезервирован
        this.levelsArr[0]=[];
        this.levelsArr[0][0]=null;
        this.levelsArr[0][1]='Уровень с 24 шарами в хранилище и тремя букетами. '+
            'Центр букета должен отличаться от цвета лепестков, лепестки каждого букета должны '+
            'быть одного цвета.';
        this.levelsArr[0][2]='Уровень с 36 шарами в хранилище, с двумя трёхлепестковыми и одним пятилепестковым '+
            'букетами. Одноцветные лепестки букетов отличаются цветом от центра.';
        this.levelsArr[0][3]='Уровень с 36 шарами в хранилище, с двумя трёхлепестковыми и одним четырёхлепестковым '+
            'с лепестками двух цветов. Одноцветные лепестки букетов отличаются цветом от центра.';
        this.levelsArr[0][4]='Уровень с 36 шарами в хранилище, с трёхлепестковым, четырёхлепестковым '+
            ' и пятилепестковым цветками.';
        this.levelsArr[0][5]='Уровень с 39 шарами в хранилище, с двумя пятилепестковыми и четырёхлепестковым '+
            'букетами.';
        this.levelsArr[0][6]='Уровень с 42 шарами в хранилище с двумя трёхлепестковыми и одним четырёхлепестковым '+
            'букетами.';
        this.levelsArr[0][7]='Уровень с 18 шарами в хранилище, с четырёхлепестковым '+
            'с лепестками двух цветов и четырёхлепестковым с одноцветными лепестками и трёхлепестковый.';
        this.levelsArr[0][8]='Уровень с 24 шарами в хранилище, с трёхлепестковым, четырёхлепестковым и'+
            ' пятилепестковым букетами.';
        this.levelsArr[0][9]='Уровень с 30 шарами в хранилище, с двумя четырёхлепестковыми с лепестками '+
            'одного цвета и четырёхлепестковым с лепестками двух цветов.';
        this.levelsArr[0][10]='Уровень с 30 шарами в хранилище, с тремя четырёхлепестковыми'+
            ' букетами.';
    }

    

    // при нажатии кнопки с номером уровня в окне levelTab отображает на игровом поле
    // информацию об уровне - букеты и набор шаров, которые присутствуют на данном уровне 
    showLvlInfo(numLvl)
    {
        this.lGrBq.setTexture("atlas",this.levelsArr[numLvl]["L"]);
        this.cGrBq.setTexture("atlas",this.levelsArr[numLvl]["C"]);
        this.rGrBq.setTexture("atlas",this.levelsArr[numLvl]["R"]);
        this.clrSeq.setTexture("atlas",this.levelsArr[numLvl]["clr"]);

        let lvlInfoWndWidth = 1000;
        let lvlInfoWndHeight = 150;
        let lvlInfoWndPadding = 10;
        
        this.lvlInfoWnd = this.scene.add.graphics({ x: 50, y: 30 });

        //  lvlInfoWnd shadow
        this.lvlInfoWnd.fillStyle(0x222222, 0.5);
        this.lvlInfoWnd.fillRoundedRect(6, 6, lvlInfoWndWidth, lvlInfoWndHeight, 16);

        //  lvlInfoWnd color
        this.lvlInfoWnd.fillStyle(0xffffff, 1);

        //  lvlInfoWnd outline line style
        this.lvlInfoWnd.lineStyle(4, 0x565656, 1);

        //  lvlInfoWnd shape and outline
        this.lvlInfoWnd.strokeRoundedRect(0, 0, lvlInfoWndWidth, lvlInfoWndHeight, 16);
        this.lvlInfoWnd.fillRoundedRect(0, 0, lvlInfoWndWidth, lvlInfoWndHeight, 16);

        let txt="Уровень "+numLvl+".\n";
        txt=txt+this.levelsArr[0][numLvl];
        this.txtObj= this.scene.add.text(0, 0, txt, { fontFamily: 'Arial', fontSize: 28,
            color: '#000000', align: 'center',
            wordWrap: { width: lvlInfoWndWidth - (lvlInfoWndPadding * 2) } });
        let txtBounds=this.txtObj.getBounds();

        this.txtObj.setPosition(this.lvlInfoWnd.x + (lvlInfoWndWidth / 2) - (txtBounds.width / 2),
            this.lvlInfoWnd.y + (lvlInfoWndHeight / 2) - (txtBounds.height / 2));

        // не работает dom объект - react перемещает и масштабирует окно
        // с этим объектом
    }

    // убирает с игрового поля букеты и набор шаров, которые вывел на экран
    // метод  showLvlInfo(numLvl)
    clearLvlInfo()
    {
        this.lGrBq.setTexture("atlas",'empty');
        this.cGrBq.setTexture("atlas",'empty');
        this.rGrBq.setTexture("atlas",'empty');
        this.clrSeq.setTexture("atlas",'empty');

        if(this.lvlInfoWnd)
        {
            this.lvlInfoWnd.destroy();
        }

        if(this.txtObj)
        {
            this.txtObj.destroy();
        }
    }

    // если уровень для игры выбран, отображаем соответствующие этому уровню
    // букеты и создаём зоны, при щелчке на которых будет вызываться zoneDownHandler
    // если withHelper=true, то необходимо сопровождать игру подсказками
    startLevel(nLvl,withHelper)
    {
        this.currentLvl=nLvl;

        // текст, отображающий количество набранных баллов за текущий уровень,
        // располагается на подложке  'balance'
        this.balanceTxt=this.scene.add.text(910,44, '0',
            { fontFamily: 'Arial, Roboto, Times, serif', 
            fontSize: 48, color: '#ffffff', align: 'center' });

        // текст, отображающий количество набранных баллов за всю игру,
        // располагается на подложке  'sumBalls', если данные недоступны,
        // выводятся прочерки
        let sumBalanceVal="---";
        if(window.myManager.isUsrResultsLoaded)
        {
            this.sumBalanceVal=window.myManager.usrResults.summa;
        }

        this.sumBalanceTxt=this.scene.add.text(855,130, this.sumBalanceVal,
                { fontFamily: 'Arial, Roboto, Times, serif', 
                fontSize: 48, color: '#ffffff', align: 'center' });

        this.ballsForBonusTxt=this.scene.add.text(140,110, 
            this.levelsArr[nLvl].numBal * 5,
            { fontFamily: 'Arial, Roboto, Times, serif', 
            fontSize: 28, color: '#ffffff', align: 'center' });

        let txt="";
        if(window.myManager.isLvlLeadsLoaded)
        {
            txt=txt+'Лидер уровня: '+
            window.myManager.lvlLeads[nLvl]["first_name"] + " " +
            window.myManager.lvlLeads[nLvl]["second_name"] + ", "+
            window.myManager.lvlLeads[nLvl]["balls"] + " баллов, " +
            window.myManager.lvlLeads[nLvl]["date"]+".\r\n\r\n";
        }

        if(window.myManager.isGameLeadLoaded)
        {
            txt=txt+'Рекорд игры: '+
            window.myManager.gameLead["first_name"] + " " +
            window.myManager.gameLead["second_name"] + ", "+
            window.myManager.gameLead["balls"] + " баллов, " +
            window.myManager.gameLead["date"]+".\r\n";
        }

        txt = "Улучшите или повторите рекорд, чтобы удвоить результат."
        

        // Закомментировано до создания правила для бонуса
        // this.lvlLeadTxt=this.scene.add.text(236,110, txt,
        //     { fontFamily: 'Arial, Roboto, Times, serif',
        //     fontSize: 24, color: '#000000', align: 'center' });

        // let bnd=this.lvlLeadTxt.getBounds();

        // this.lvlLeadTxt.setWordWrapWidth(320);
        // this.lvlLeadTxt.setOrigin(0.5,0);

        //если нужны подсказки, то создаём окно для их вывода
        if(this.withHelper)
        {
            
        }

        this.bqL=this.addBouqet(this.levelsArr[nLvl].L,204, 414);
        this.bqC=this.addBouqet(this.levelsArr[nLvl].C,554, 414);
        this.bqR=this.addBouqet(this.levelsArr[nLvl].R,904, 414);

        // получаем картинки для ценниов
        this.tweenImageL=this.bqL.createTween();
        this.tweenImageL.setData({bq:'L'});
        this.tweenImageC=this.bqC.createTween();
        this.tweenImageC.setData({bq:'C'});
        this.tweenImageR=this.bqR.createTween();
        this.tweenImageR.setData({bq:'R'});

        

        this.createBallSet(nLvl);

        this.remBalsTxt.text=this.remBals;
        this.bigRemBalsTxt.text=this.remBals;

        this.tweenL=this.scene.tweens.add({
            targets: this.tweenImageL,
            x: 960,
            y: 65,
            alpha: 0.5,
            duration: 700,
            paused: 'true',
            onComplete: () => {
                this.onBqTweenComplete("L",this.tweenImageL);
            }});

        //this.tweenL.setCallback('onComplete',this.onBqTweenComplete, [this], this);

        //this.bqC.tweenPrImg.name='C';
        this.tweenC=this.scene.tweens.add({
            targets: this.tweenImageC,
            x: 960,
            y: 65,
            alpha: 0.5,
            duration: 400,
            paused: 'true',
            onComplete: () => {
                this.onBqTweenComplete("C",this.tweenImageC);
            }});

        //this.tweenC.setCallback('onComplete',this.onBqTweenComplete,[this],this);

        //this.bqR.tweenPrImg.name='R';
        this.tweenR=this.scene.tweens.add({
            targets: this.tweenImageR,
            x: 960,
            y: 65,
            alpha: 0.5,
            duration: 300,
            paused: 'true',
            onComplete: () => {
                this.onBqTweenComplete("R",this.tweenImageR);
            }});

        //this.tweenR.setCallback('onComplete',this.onBqTweenComplete,[this],this);

        this.zoneL.setInteractive();
        this.zoneC.setInteractive();
        this.zoneR.setInteractive();
        
        this.scene.input.on('gameobjectdown', this.zoneDownHandler, this);

        this.scene.events.once('update', 
            ()=>{window.game.scale.updateBounds()})

        // попытка перевести в полноэкранный режим
        if(this.scene.sys.game.device.fullscreen.available)
        {
             
        }

        this.scene.scale.addListener(window.Phaser.Scale.Events.ORIENTATION_CHANGE,
            ()=>{this.scene.scale.refresh();
                 console.log("orientayion changed")});
    }

    onBqTweenComplete(bqName, target)
    {
        let gb = arguments[2]
        target.x=target.data.values.x;
        target.y=target.data.values.y;
        target.alpha=1;

        switch(bqName)
        {
            case "L":
                this.bqL.clear();
                //this.bqL.clear();
                break;
            case "C":
                this.bqC.clear();
                break;
            case "R":
                this.bqR.clear();
                break;
        }
        this.balanceTxt.text=this.balance;
        this.isTween=false;
        let lastEl=this.baloonGroup.getLast(true);
        // если этот шар, который завершил букет оказался последним
        if(!lastEl)
        {
            this.zoneL.disableInteractive();
            this.zoneC.disableInteractive();
            this.zoneR.disableInteractive();
            this.remBalsTxt.text='';
            this.bigRemBalsTxt.text='';
            if(this.withHelper && this.helperWmd)
            {
                this.helperWmd.visible=false;
            }
            
            this.resumeLevel(true);
        }
    }

    // обработчик щелчка на зонах, в которых находятся букеты, если
    // добавение возможно, то шар из хранилища добавляется в букет, а
    // в самом хранилище шары передвигаются на одну позицию
    zoneDownHandler(pointer,obj)
    {
        if(this.helperWnd)
        {
            this.helperWnd.destroy();
        }

        if(this.txtObj)
        {
            this.txtObj.destroy();
        }

        window.game.scale.updateBounds();
        let z=this.zoneL;
        let b=this.scene.textures.list ;

        // если выполняется твин или связанный с ним колбэк, то ничего не делаем
        if(this.isTween) return;

        let bq,balloonName,newEl,firstEl,lastEl,bqPrice,tween, curTarget;
        
        // выясняем на каком букете щёлкнули
        switch(obj.name)
        {
            case 'L':
                bq=this.bqL;
                bqPrice=this.levelsArr[this.currentLvl].prL;
                tween=this.tweenL;
                curTarget = this.tweenImageL;
                break;
            case 'C':
                bq=this.bqC;
                bqPrice=this.levelsArr[this.currentLvl].prC;
                tween=this.tweenC;
                curTarget = this.tweenImageC;
                break;
            case 'R':
                bq=this.bqR;
                bqPrice=this.levelsArr[this.currentLvl].prR;
                tween=this.tweenR;
                curTarget = this.tweenImageR;
                break;
        }

        // выясняем какого цвета очередной шар в хранилище
        firstEl= this.baloonGroup.getFirst(true);
        let numClr= firstEl.data.values.numClr;

        // на стадии отладки полностью собранный букет очищаем не сразу
        // после добавления, т.е. не сразу после bq.addBalloon(numClr)
        //if(bq.isCopleted()) bq.clear();

        // если в выбранный щелчком букет добавить шар невозможно, то просто выходим,
        // если необходима подсказка (для тех, кто ещё ни одного уровня не проходил),
        // то перед выходом выводим окно helperWmd с пояснениями 
        if(bq.isAdable(numClr)==-1)
        {
            if(this.withHelper)
            {
                let txt;
                //this.helperWmd.visible=false;
                switch(obj.name)
                {
                    case 'L':
                        txt=this.bqL.getHelping();
                        break;
                    case 'C':
                        txt=this.bqC.getHelping();
                        break;
                    case 'R':
                        txt=this.bqR.getHelping();
                        break;
                }
                document.getElementById('phaCont').dispatchEvent(
                    new CustomEvent("nonCorrectAction", {
                        bubbles: true,
                        detail: { titleStr: txt }
                    }));

                    // document.getElementById('phaCont').dispatchEvent(
                    //     new CustomEvent("popstate", {
                    //         bubbles: true,
                    //         detail: { titleStr: txt }
                    //     }));
            }
            return;
        }
        else
        {
            if(this.withHelper)
            {
                let txt="Щелчком (тапом) добавляйте шары в букеты. "
            }
        }

        // если предыдущий блок не выполнился, то добавление возможно,
        // добавляем шар в букет, записываем ход в массив this.movesArr, обновляем хранилище
        bq.addBalloon(numClr);
        this.movesArr.push(obj.name);
        this.updateBallGrp();

        // первый шар в хранилище (он расположен на левом краю группы) удаляем -
        // он отправляется в букет, саму группу смещаем влево нв ширину удаленного
        // шара, а с правой стороны добавляем следующий шар из массива с набором
        // шаров balloonSetArr

        // если букет собран, то добавление всяко возможно, поэтому
        // запускаем твин и выходим
        if(bq.isCopleted())
        {
            this.balance+=bqPrice;
            this.isTween=true;
            let tween = this.scene.tweens.add({
                targets: curTarget,
                x: 960,
                y: 65,
                alpha: 0.5,
                duration: 700,
                paused: 'true',
                onComplete: () => {
                    this.onBqTweenComplete(obj.name,curTarget);
                }});
            tween.play();
            return;
        } 

        lastEl=this.baloonGroup.getLast(true);
        // если lastEl==null значит, что шары в видимой части хранилища закончились, 
        // надо заканчивать игру
        if(!lastEl)
        {
            this.zoneL.disableInteractive();
            this.zoneC.disableInteractive();
            this.zoneR.disableInteractive();
            this.remBalsTxt.text='';
            this.bigRemBalsTxt.text='';
            
            this.resumeLevel(true);
            return;
        }
        

        firstEl= this.baloonGroup.getFirst(true);
        numClr= firstEl.data.values.numClr;
        // теперь надо проверить, можно ли продолжить игру, т.е. возможно ли
        // добавить в какой-либо букет очередной шар из хранилища
        if((this.bqL.isAdable(numClr)==-1)&&(this.bqC.isAdable(numClr)==-1)&&
            (this.bqR.isAdable(numClr)==-1))
        {
            this.zoneL.disableInteractive();
            this.zoneC.disableInteractive();
            this.zoneR.disableInteractive();
            if(this.withHelper && this.helperWmd)
            {
                this.helperWmd.visible=false;
            }
            
            this.resumeLevel(false);
            return;
        }
    }

    
    // добавляет на игровое поле букет, указанный в bqType по координатам cX, cY
    addBouqet(bqType,cX, cY)
    {
        let bqObj;
        switch(bqType)
        {
            case 'grBq1_2_2':
                bqObj=new Bouq1_2_2(this.scene,cX, cY);
                return bqObj;
                break;
            case 'grBq1_3':
                bqObj=new Bouq1_3(this.scene,cX, cY);
                return bqObj;
                break;
            case 'grBq1_4':
                bqObj=new Bouq1_4(this.scene,cX, cY);
                return bqObj;
                break;
            case 'grBq1_5':
                bqObj=new Bouq1_5(this.scene,cX, cY);
                return bqObj;
                break;
        }
    }

    // создаём хранилище шаров, которые будут добавляться в букеты,
    // массив balloonSetArr заполняем номерами шаров и создаём группу
    // с изображением шаров, которая будет отображаться на игровом поле - это
    // видимая часть хранилища, которая содержит не более 30 шаров и по мере 
    // извлечения из неё шаров для добавления, добавляются новые
    createBallSet(nLvl)
    {
        switch(this.levelsArr[nLvl].clr)
        {
            case 'clr012012' :
                this.sampleArr=[0,1,2,0,1,2];
                break;
            case 'clr001122' :
                this.sampleArr=[0,0,1,1,2,2];
                break;
            case 'clr011222' :
                this.sampleArr=[0,1,1,2,2,2];
                break;
            case 'clr01122200' :
                this.sampleArr=[0,1,1,2,2,2,0,0,1,1,1,2,0,0,0,1,2,2];
                break;
        }

        this.baloonGroup=this.scene.add.group();

        let balloonName,balloonImg;

        for(let i=0;i<this.levelsArr[nLvl].numBal;i++)
        {
            this.balloonSetArr[i]=this.sampleArr[i%this.sampleArr.length];

            switch(this.balloonSetArr[i])
            {
                case 0:
                    balloonName='redBalloon';
                    break;
                case 1:
                    balloonName='greenBalloon';
                    break;
                case 2:
                    balloonName='blueBalloon';
                    break;
            }

            // на экране будет отображаться не более 30 шаров хранилища
            if(i<30)
            {
                balloonImg=this.baloonGroup.create(60+i*35,640,"atlas", balloonName);
                balloonImg.setData('numClr',this.balloonSetArr[i]);
                balloonImg.setData('index',i);
            }
        }

        // первый шар в хранилище "увеличиваем" и в верхний счётчик
        // выводим шар того же цвета, что и первый в хранилище
        let firstEl= this.baloonGroup.getFirst(true);
        let numClr= firstEl.data.values.numClr;
        let bgCounterName;
        switch(numClr)
        {
            case 0:
                balloonName='bigRedBal';
                bgCounterName = 'redCounterBg';
                break;
            case 1:
                balloonName='bigGreenBal';
                bgCounterName = 'greenCounterBg';
                break;
            case 2:
                balloonName='bigBlueBal';
                bgCounterName = 'blueCounterBg';
                break;
        }
        firstEl.setTexture("atlas",balloonName);
        firstEl.y=620;
        firstEl.x=firstEl.x-12;

        this.counterBg.setTexture("atlas",bgCounterName)

        this.remBals=this.levelsArr[this.currentLvl].numBal;
        if (!this.remBalsTxt) {
            this.remBalsTxt = this.scene.add.text(48, 614, '',
                {
                    fontFamily: 'Arial, Roboto, Times, serif',
                    fontSize: 36, color: '#ffffff', align: 'center'
                });
            this.remBalsTxt.depth = 1;
            this.remBalsTxt.setOrigin(0.5, 0.5);
        }
        if (!this.bigRemBalsTxt) {
            this.bigRemBalsTxt = this.scene.add.text(545, 115, '',
                {
                    fontFamily: 'Arial, Roboto, Times, serif',
                    fontSize: 72, color: '#ffffff', align: 'center'
                });
            this.bigRemBalsTxt.depth = 1;
            this.bigRemBalsTxt.setOrigin(0.5, 0.5);
        }
        this.remBalsTxt.text=this.remBals;
        this.bigRemBalsTxt.text=this.remBals;
    }

    // создаём хранилище шаров для обучалки, без верхнего счётчика
    // массив balloonSetArr заполняем номерами шаров и создаём группу
    // с изображением шаров, которая будет отображаться на игровом поле - это
    // видимая часть хранилища, которая содержит не более 30 шаров и по мере 
    // извлечения из неё шаров для добавления, добавляются новые
    createIntroBallSet(){
        const introBallsSetArr=[1,0,0,2,0,2,1,0,1];
        this.baloonGroup=this.scene.add.group();

        let balloonName,balloonImg;

        for(let i=0; i<introBallsSetArr.length; i++)
        {
            switch(introBallsSetArr[i])
            {
                case 0:
                    balloonName='redBalloon';
                    break;
                case 1:
                    balloonName='greenBalloon';
                    break;
                case 2:
                    balloonName='blueBalloon';
                    break;
            }
            // на экране будет отображаться не более 30 шаров хранилища
            if(i<30)
            {
                balloonImg=this.baloonGroup.create(60+i*35,640,"atlas", balloonName);
                balloonImg.setData('numClr',introBallsSetArr[i]);
                balloonImg.setData('index',i);
            }
        }

        // первый шар в хранилище "увеличиваем" 
        let firstEl= this.baloonGroup.getFirst(true);
        let numClr= firstEl.data.values.numClr;
        let bgCounterName;
        switch(numClr)
        {
            case 0:
                balloonName='bigRedBal';
                break;
            case 1:
                balloonName='bigGreenBal';
                break;
            case 2:
                balloonName='bigBlueBal';
                break;
        }

        firstEl.setTexture("atlas",balloonName);
        firstEl.y=620;
        firstEl.x=firstEl.x-12;

        this.remBals=introBallsSetArr.length;
        if(!this.remBalsTxt)
        {
            this.remBalsTxt=this.scene.add.text(48,614, '',
                { fontFamily: 'Arial, Roboto, Times, serif',
                fontSize: 36, color: '#ffffff', align: 'center' });
                this.remBalsTxt.depth=1;
                this.remBalsTxt.setOrigin(0.5,0.5);
        }
        this.remBalsTxt.text=this.remBals;
    }

    // после добавлении в букет шара из хранилища, необходимо обновить группу шаров,
    // данный метод этим и занимается
    updateBallGrp()
    {
        // первый шар в хранилище (он расположен на левом краю группы) удаляем -
        // он отправляется в букет, саму группу смещаем влево нв ширину удаленного
        // шара, а с правой стороны добавляем следующий шар из массива с набором
        // шаров balloonSetArr
        let balloonName;
        let newEl;
        let firstEl= this.baloonGroup.getFirst(true);
        this.baloonGroup.remove(firstEl,true,true);
        this.baloonGroup.incX(-35);
        let lastEl=this.baloonGroup.getLast(true);

        // если lastEl==null значит, что шары в видимой части хранилища закончились, 
        // надо заканчивать игру
        if(!lastEl) return false;
        let ind= lastEl.data.values.index;

        // если шары в невидимой части хранилища ещё остались, выводим 
        // следующий по очереди на экран в правой части
        if(ind<this.balloonSetArr.length-1)
        {
            switch(this.balloonSetArr[ind+1])
            {
                case 0:
                    balloonName='redBalloon';
                    break;
                case 1:
                    balloonName='greenBalloon';
                    break;
                case 2:
                    balloonName='blueBalloon';
                    break;

            }
            newEl=this.baloonGroup.create(lastEl.x+35,lastEl.y,"atlas",balloonName);
            newEl.setData('numClr',this.balloonSetArr[ind+1]);
            newEl.setData('index',ind+1);
        }

        firstEl= this.baloonGroup.getFirst(true);
        let numClr= firstEl.data.values.numClr;
        let bgCounterName;
        switch(numClr)
        {
            case 0:
                balloonName='bigRedBal';
                bgCounterName='redCounterBg'
                break;
            case 1:
                balloonName='bigGreenBal';
                bgCounterName='greenCounterBg'
                break;
            case 2:
                balloonName='bigBlueBal';
                bgCounterName='blueCounterBg'
                break;
        }
        firstEl.setTexture("atlas", balloonName);
        firstEl.y=620;
        firstEl.x=firstEl.x-12;
        // в верхнем счётчике выставляем шар следующего цвета
        this.counterBg.setTexture("atlas",bgCounterName)
        this.remBalsTxt.text=this.levelsArr[this.currentLvl].numBal-firstEl.data.values.index;
        this.bigRemBalsTxt.text=this.levelsArr[this.currentLvl].numBal-firstEl.data.values.index;
    }

    updateIntroBallGrp(){
        // первый шар в хранилище (он расположен на левом краю группы) удаляем -
        // он отправляется в букет, саму группу смещаем влево нв ширину удаленного
        // шара, а с правой стороны добавляем следующий шар из массива с набором
        // шаров balloonSetArr
        let balloonName;
        let newEl;
        let firstEl= this.baloonGroup.getFirst(true);
        this.baloonGroup.remove(firstEl,true,true);
        this.baloonGroup.incX(-35);
        let lastEl=this.baloonGroup.getLast(true);

        // если lastEl==null значит, что шары в видимой части хранилища закончились, 
        // надо заканчивать игру
        if(!lastEl) return false;
        let ind= lastEl.data.values.index;

        firstEl= this.baloonGroup.getFirst(true);
        let numClr= firstEl.data.values.numClr;
        switch(numClr)
        {
            case 0:
                balloonName='bigRedBal';
                break;
            case 1:
                balloonName='bigGreenBal';
                break;
            case 2:
                balloonName='bigBlueBal';
                break;
        }
        firstEl.setTexture("atlas", balloonName);
        firstEl.y=620;
        firstEl.x=firstEl.x-12;
        // в верхнем счётчике выставляем шар следующего цвета
        //this.counterBg.setTexture("atlas",bgCounterName)
        this.remBalsTxt.text=this.baloonGroup.children.size;
    }

    // вызывается, если пользователь захотел повторно пройти уровень
    replayLevel()
    {
        this.bqL.clear();
        this.bqC.clear();
        this.bqR.clear();
        if(this.remBalsTxt) this.remBalsTxt.destroy();
        this.remBalsTxt=null;
        if(this.bigRemBalsTxt) this.bigRemBalsTxt.destroy();
        this.bigRemBalsTxt=null;
        this.balloonSetArr=[];
        this.movesArr=[];
        this.baloonGroup.clear(true,true);
        this.createBallSet(this.currentLvl);
        this.balance=0;
        this.balanceTxt.text=this.balance;
        this.sumBalance = window.myManager.usrResults.summa;
        this.sumBalanceTxt.text = this.sumBalance;
        this.isBonusImg.setTexture('atlas','empty');
        this.bonusPrice.setTexture('atlas','empty');
        this.ballsForBonusTxt.text = this.levelsArr[this.currentLvl].numBal*5;
        
        this.zoneL.setInteractive();
        this.zoneC.setInteractive();
        this.zoneR.setInteractive();

        
    }

    // вызывается при нажатии кнопки в окне endLvlWnd когда пользователь
    // решает покинуть уровень 
    clearGB()
    {
        this.bqL.clearAll();
        this.bqC.clearAll();
        this.bqR.clearAll();
        this.balloonSetArr=[];
        this.baloonGroup.clear(true,true);
        this.balance=0;
        this.balanceTxt.text=this.balance;
        this.remBalsTxt.destroy();
        this.remBalsTxt=null;
        this.bigRemBalsTxt.destroy();
        this.bigRemBalsTxt=null;
        this.currentLvl=null;
        this.ballsForBonusTxt=null;
        this.isBonusImg.setTexture('atlas','empty');
        this.bonusPrice.setTexture('atlas','empty');

        this.clearLvlInfo();
        this.scene.input.off('gameobjectdown', this.zoneDownHandler);
    }

    // очищаем gameBoard после показа обучалки
    clearIntro(){
        this.tutorRibbon.setTexture('atlas',"empty")
        this.bqL.clearAll();
        this.bqC.clearAll();
        this.bqR.clearAll();
        this.balloonSetArr=[];
        this.baloonGroup.clear(true,true);
        this.balance=0;
        //this.balanceTxt.text=this.balance;
        if(this.remBalsTxt) this.remBalsTxt.destroy();
        this.remBalsTxt=null;
        //this.bigRemBalsTxt.destroy();
        //this.bigRemBalsTxt=null;
        this.currentLvl=null;
        //this.ballsForBonusTxt=null;
        this.isBonusImg.setTexture('atlas','empty');
        this.bonusPrice.setTexture('atlas','empty');

        // восстанавливаем элементы дизайна - плашки для бонуса и баллов,
        // которые удалили в startIntro
        this.scene.add.image(234,112,"atlas",'bonusImg');

        // подложка с надписью "Всего" для размещения на ней числа набранных баллов
        // за всю игру
        this.scene.add.image(862, 155,"atlas", 'sumBalls').setVisible(true);

        // подложка с надписью "Баланс" для размещения на ней числа набранных баллов
        // за данный уровень
        this.scene.add.image(862, 68,"atlas", 'balance').setVisible(true);
    }

    // isCompleted=true, если уровень пройден, false в противном случае 
    resumeLevel(isCompleted)
    {
        // строка сообщений для диалогового окна vkui
        let titleStr;

        // номер текущего уровня
        let numLvl=this.currentLvl;

        // текущий лучший результат для данного уровня
        let curResult=window.myManager.usrResults['lvl_'+this.currentLvl];

        // количество набранных баллов на текущем уровне this.myGB.currentLvl
        let balance=this.balance;

        // максимально возможный результат
        let maxPossible=this.levelsArr[numLvl].numBal*5;

        // если результат максимальный, добавляем бонус
        if(balance == maxPossible){
            balance+=50;
            maxPossible+=50;
            this.balance+=50;
            this.balanceTxt.text = this.balance;
        }

        // флаг, показывающий следует ли сохранять результат на сервере
        let needToSave=false;
    
        let solution=this.movesArr;

        // если уровень пройден впервые или улучшен предыдущий результат
        // на этом уровне для данного пользователя, пытаемся сохранить результат на сервере
        if(isCompleted && (balance>=curResult))
        {
            needToSave=true;
        }

        // если уровень пройден
        if(isCompleted)
        {
            // если прежде уровень не проходился, то открываем ещё один
            // уровень, наименьший из закрытых
            if(curResult==0)
            { 
                 // если показан максимально возможный результат
                if(balance==maxPossible)
                {
                    this.isBonusImg.setTexture("atlas",'bonusAdd');
                    this.bonusPrice.setTexture("atlas",'50');
                    //this.ballsForBonusTxt.destroy();
                    this.ballsForBonusTxt.text = '';
                    
                    titleStr="Поздравляем! Вы прошли уровень "+numLvl+ 
                        " с максимальным результатом и получаете бонус !";
                }
                else
                {
                    titleStr="Поздравляем! Вам удалось пройти уровень "+numLvl+ " !";
                }
            }
            // если уровень был уже ранее пройден
            else
            {
                // если прежний результат улучшен
                if(balance > curResult)
                {
                    // если уровень пройден впервые или улучшен предыдущий результат
                    // на этом уровне, пытаемся сохранить результат на сервере
                    titleStr="Поздравляем! Вы прошли уровень "+numLvl+ 
                    " и улучшили свой результат !";
                }
                // если прежний результат улучшить не удалось
                else
                {
                    titleStr="Поздравляем! Вы прошли уровень "+numLvl+ 
                    ", но не удалось превзойти своё лучшее достижение.";
                }
                // если показан максимально возможный результат
                if(balance==maxPossible)
                {
                    this.isBonusImg.setTexture("atlas",'bonusAdd');
                    this.bonusPrice.setTexture("atlas",'50');
                    //this.ballsForBonusTxt.destroy();
                    this.ballsForBonusTxt.text = '';
                    titleStr="Поздравляем! Вы прошли уровень "+numLvl+ 
                    " с максимальным результатом и получаете бонус !";
                }
            }
        }
        // если уровень не пройден
        else
        {
            titleStr="Вам, к сожалению, не удалось пройти уровень "+numLvl+ 
                ", но Вы можете попытаться сделать это ещё раз.";
        }
        
        document.getElementById('phaCont').dispatchEvent(new CustomEvent("resumeLvl", {
            bubbles: true,
            detail: {
                        titleStr:titleStr,
                        numLvl: numLvl,
                        balance: balance,
                        solution: solution,
                        needToSave: needToSave }
                    })); 
    }

    refreshScene()
    {
        this.refresh();
        this.updateBounds();
    }

    startIntro(){
        this.bqL=this.addBouqet(this.levelsArr[1].L,204, 414);
        this.bqC=this.addBouqet(this.levelsArr[1].C,554, 414);
        this.bqR=this.addBouqet(this.levelsArr[1].R,904, 414);
        this.tutorRibbon = this.scene.add.image(550,70,"atlas",'newTutorRibbon');
        let innerScene = this.scene;

        this.bqC.addBalloon(0);
        this.bqC.addBalloon(1);

        this.bqL.addBalloon(2);

        this.createIntroBallSet();

        // удаляем плашки для объявления о бонусе и информации о
        // набранных очках и общем балансе - они при проигрывании обучалки
        // не отображаются
        let array = this.scene.children.getChildren()
        let obj = array.find(item =>{
            return ("type" in item)&&("frame" in item)&&
            (item.type == "Image")&&(item.frame.name == "bonusImg")
        })
        if(obj) obj.setTexture("atlas",'empty');

        obj = array.find(item =>{
            return ("type" in item)&&("frame" in item)&&
            (item.type == "Image")&&(item.frame.name == "sumBalls")
        })
        if(obj) obj.setTexture("atlas",'empty');

        obj = array.find(item =>{
            return ("type" in item)&&("frame" in item)&&
            (item.type == "Image")&&(item.frame.name == "balance")
        })
        if(obj) obj.setTexture("atlas",'empty');

        document.getElementById('phaCont').dispatchEvent(new CustomEvent("introMsg", {
            bubbles: true,
            detail: {
                type:"msg",
                text: "Кликом(тапом) добавляйте подходящие по цвету шарики "+
                "в цветок(букет). ",
                show:true
            }
        })); 

        let handImg = this.scene.add.image(550,480,"atlas",'hand');
        handImg.scale = 2;

        this.scene.tweens.chain({
            tweens: [
                // щелчок на среднем
                {
                    targets: handImg,
                    props: {
                        scale: { value: 1 },
                        y: { value: 414 }
                    },
                    startDelay:1500, 
                    duration: 300,
                    delay:2000,
                    ease: 'sine.out',
                    yoyo: false,
                    repeat: 0,
                    onComplete: () => {
                        this.bqC.addBalloon(1);
                        this.updateIntroBallGrp();
                        document.getElementById('phaCont').dispatchEvent(new CustomEvent("introMsg", {
                            bubbles: true,
                            detail: {
                                type:"msg",
                                text: "",
                                show:false
                            }
                        }));
                    }
                },
                // щелчок на левом
                {
                    targets: handImg,
                    props: {
                        scale: { value: 2, yoyo: true },
                        x: { value: 204, yoyo: false }
                    },
                    delay: 500,
                    duration: 500,
                    ease: 'sine.inout',
                    repeat: 0,
                    onComplete: () => {
                        this.bqL.addBalloon(0);
                        this.updateIntroBallGrp();
                    }
                },
                // ещё раз на левом
                {
                    targets: handImg,
                    props: {
                        scale: { value: 2, yoyo: true },
                    },
                    delay: 500,
                    duration: 300,
                    ease: 'sine.inout',
                    repeat: 0,
                    onComplete: () => {
                        this.bqL.addBalloon(0);
                        this.updateIntroBallGrp();
                    }
                },
                // щелчок на правом
                {
                    targets: handImg,
                    props: {
                        scale: { value: 2, yoyo: true },
                        x: { value: 904, yoyo: false }
                    },
                    delay: 500,
                    duration: 1000,
                    ease: 'sine.inout',
                    repeat: 0,
                    onComplete: () => {
                        this.bqR.addBalloon(2);
                        this.updateIntroBallGrp();
                        document.getElementById('phaCont').dispatchEvent(new CustomEvent("introMsg", {
                            bubbles: true,
                            detail: {
                                type:"msg",
                                text: "Получайте баллы за каждый собранный букет(цветок).",
                                show : true
                            }
                        }));
                    }
                },
                {
                    targets: handImg,
                    props: {
                        scale: { value: 2, yoyo: true },
                        x: { value: 204, yoyo: false }
                    },
                    startDelay:1500,
                    delay: 2000,
                    duration: 1000,
                    ease: 'sine.inout',
                    repeat: 0,
                    onComplete: () => {
                        this.bqL.addBalloon(0);
                        this.updateIntroBallGrp();
                        document.getElementById('phaCont').dispatchEvent(new CustomEvent("introMsg", {
                            bubbles: true,
                            detail: {
                                type:"msg",
                                text: "",
                                show : false
                            }
                        }));
                    }
                },
                {
                    targets: this.bqL.prImg,
                    props: {
                        y: { value: 65, yoyo: false },
                        x: { value: 960, yoyo: false },
                        alpha:{value: 0.5, yoyo: false}
                    },
                    duration: 1000,
                    ease: 'linear',
                    repeat: 0,
                    onComplete: () => {
                        this.bqL.clear();
                        handImg.setTexture('atlas','empty')
                        document.getElementById('phaCont').
                            dispatchEvent(new CustomEvent("introMsg",{
                             bubbles: true,
                             detail:{
                                type: "prompt",
                                text:"Начать игру или повторить 'Обучалку'?",
                                show: true
                             }
                             }));
                    }
                }
            ],
        });
    }
}