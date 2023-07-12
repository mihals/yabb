import GameBoard from './bb/gameBoard.js';

// объект этого класса должен управлять ходом игры, переключаясь между разными
// стадиями: загрузка ассетов, подключение к профилю пользователя (если приложение
// интегрировано в соцсеть), вывод таблицы уровней, окон диалога и т.п. 

// -7 - ошибка, которую сервер возвращает, если пользователь с таким id
//      не найден
// -12 - ошибка, назначаемая клиентской частью при невозможности прочесть данные
//       в объекты данных о лидерах уровней, лидеров игры или данных пользователя

export default class Manager
{
    
    constructor(scene)
    {
        // инициализируем свойства для проверки получения данных, используемых в игре,
        // изначально они равны null и если загрузка не удалась, свойству присваивается false,
        // при удачной загрузке присваивается true
        
        // загружены ли спрайты
        this.isSpritesLoaded=null;

        // удалось ли получить идентификационные данные пользователя( id, first_name,
        // и др.) из адресной строки или из объекта bridge 
        this.isUserInfoLoaded=null;

        // удалось ли получить данные о рейтинге игрока
        this.isUsrRatingLoaded=null;

        // удалось ли получить данные о результатах пользователя с сервера
        this.isUsrResultsLoaded=null;

        // удалось ли получить данные о лидере игры с сервера
        this.isGameLeadLoaded=null;

        // объект, содержащий достижения пользователя в баллах по уровням, для
        // недоступных уровней значение this.usrResults[numLvl]==-1, для доступных
        // для прохождения, но ещё не пройденных уровней this.usrResult[numLvl]==0,
        // для пройденных уровней this.usrResult[numLvl] равен числу баллов,
        // набранных в результате прохождении уровня.
        this.usrResults=null;

        // рейтинг игрока - место в лидерборде
        this.usrRating=null;

        // данные о лидерах игры - три первых места
        this.gameLead={};

        // объект класса GameBoard, который отвечает за создание и расстановку букетов
        // и создание массива цветов в зависимости от выбранного уровня
        //this.myGB=new GameBoard(scene);
        
        // объект, содержащий достижения пользователя в баллах по уровням, для
        // недоступных уровней значение this.lvlsData.arr[numLvl]==-1, для доступных
        // для прохождения, но ещё не пройденных уровней this.lvlsData.arr[numLvl]==0,
        // для пройденных уровней this.lvlsData.arr[numLvl] равен числу баллов,
        // набранных в результате прохождении уровня.
        // arr - это либо массив def, либо массив loc, либо массив cur
        // массив this.lvlsData.def определяется при создании объекта manager и будет
        // испольван, если не удастся получить данные ни для this.lvlsData.loc из
        // localStorage, ни для this.lvlsData.cur из storage на сервере вк. Если не
        // удалось получить данные с сервера вк, но достижения пользователя сохранены
        // в localStorage, то заполняем этими данными массив this.lvlsData.loc и этот
        // массив и будет использоваться в дальнейшем
        /* this.lvlsData={};
        this.lvlsData.def= [Date.now(),0,-1,-1,-1,-1,-1,-1,-1,-1,-1];
        this.lvlsData.loc=null;
        this.lvlsData.cur=null; */

        // После загрузки страницы,
        // пытаемся получить this.lvlsDataArr из хранилища localStorage в виде json и, если
        // получить из хранилища не удалось или возникла ошибка при преобразовании
        // из json в массив, то присваиваем массиву значение по умолчанию:
        // this.lvlsDataArr=[Data.now(),0,0,0,-1,-1,-1,-1,-1,-1,-1]. После того, как этому
        // массиву присвоено значение (из хранилища или по умолчанию), совершаем
        // асинхронный запрос к VKApi и до тех пор, пока не будут получены актуальные
        // значения достижений пользователя, в игре будет использовано текущее
        // значение массива  this.lvlsDataArr
        this.lvlsDataArr=null;

        this.userInfo=null; 

        // если удалось получили корректные и актуальные данные для массива this.lvlsDataArr,
        // то isLvlsDataActual=true, а до тех пор, пока нет корректного ответа на
        // асинхронный запрос this.isLvlsDataActual=false
        this.isLvlsDataActual=false;

        // массив this.lvlLeadArr содержит данные о лидерах уровней. Присваивание значений 
        // этому массиву происходит примерно по тому же алгоритму, что и для массива
        // this.lvlsDataArr, описанному выше: читаем из localStorage и преобрвзуем
        // из json в массив. Если что-то не получилось, назначаем this.lvlLeadArr
        // значение по умолчанию:
        // this.lvlLeadArr=[{'date':Date.now()},{name:'Автор',balls:0},{name:'Автор',balls:0},
        //     {name:'Автор',balls:0},{name:'Автор',balls:0},{name:'Автор',balls:0},
        //     {name:'Автор',balls:0},{name:'Автор',balls:0},{name:'Автор',balls:0},
        //     {name:'Автор',balls:0},{name:'Автор',balls:0}];
        // После присвоения значения this.lvlLeadArr, делаем асинхронный запрос к серверу и 
        // ждём получения актуальных данных для this.lvlLeadArr, а пока они не пришли,
        // используем имеющиеся
        this.lvlLeadArr=null;

        // если удалось получили корректные и актуальные данные для массива this.lvlLeadArr,
        // то lvlLeadIsLoaded=true, а до тех пор, пока нет корректного ответа на
        // асинхронный запрос this.lvlLeadIsLoaded=null
        this.lvlLeadIsLoaded=null;

        // если пользователь первый раз в игре, то this.isDebut=true, чтобы определить
        // это, проверяется четвёртый уровень - поскольку первые три уровня доступны
        // по умолчанию, то, если четвёртый уровень недоступен, значит, ни одного
        // уровня ешё не пройдено
        this.isDebut=true;

        //
        this.selectedLvl=null;

        this.imgKeyArr=null;

        // объект, содержащий идентификационные данные о пользователе, ключи авторизации 
        // и другие данные, которые используются для отправки решения на проверку и
        // внесения изменений в БД на сервере
        this.userData={};
        //this.baseCache=new Phaser.Cache.BaseCache();
        this.interstitialAdEnable = false;
    }

    // loadImages()
    // {
    //     // загружаем спрайты для игры в this.baseCache, в случае успеха
    //     // this.spritesIsLoaded присваивается true, в случае ошибки false,
    //     // изначально this.spritesIsLoaded равно null
        
    //     let promiseCache = new Promise((resolve,reject)=>
    //     {
    //         //resolve(123); 
    //         //'img/bg.png',
    //         let imgSrcArr=['img/bgBouq.png','img/sumBalls.png','img/balance.png',
    //             'img/ratingBg.png','img/empty.png','img/grBq1_2_2.png', 'img/grBq1_3.png', 'img/grBq1_4.png',
    //             'img/grBq1_5.png', 'img/redHPest.png', 'img/greenHPest.png', 'img/blueHPest.png', 'img/clr012012.png',
    //             'img/clr001122.png', 'img/clr011222.png', 'img/clr01122200.png','img/redBalloon.png',
    //             'img/greenBalloon.png','img/blueBalloon.png','img/cRedBal.png','img/cGreenBal.png','img/cBlueBal.png',
    //             'img/redBal.png','img/greenBal.png','img/blueBal.png','img/bigRedBal.png','img/bigGreenBal.png',
    //             'img/bigBlueBal.png','img/20.png','img/25.png','img/30.png'];

    //         let numMissingImg=imgSrcArr.length;
    //         this.imgKeyArr=new Array(imgSrcArr.length);
    //         for(let i=0;i<imgSrcArr.length;i++)
    //         {
    //             this.imgKeyArr[i]=imgSrcArr[i].slice(4,-4);
    //         }

    //         let imgArr=new Array(imgSrcArr.length);
    //         let numLoadedImg=0;
    //         for(let i=0;i<imgSrcArr.length;i++)
    //         {
    //             imgArr[i]=new Image();
    //             imgArr[i].onload=()=>{
    //                 window.baseCache.add(this.imgKeyArr[i],imgArr[i]);
    //                 numLoadedImg++;
    //                 if(numLoadedImg==numMissingImg)
    //                 {
    //                      resolve(true);
    //                 }
    //             }
    //             imgArr[i].onerror=()=>{
    //                 reject(new Error("Failed load "+imgArr[i].src));}; 
    //             imgArr[i].src=imgSrcArr[i];
    //         }
    //     });

    //     promiseCache.then(
    //         result=>{this.isSpritesLoaded=true;
    //             let a=0;},
    //         error=>{this.isSpritesLoaded=false;
    //             console.log(error.message)});
    // }

    loadData(result)
    {
        // в случае возникновения ошибки при загрузке данных с сервера преобразованный
        // из json строки объект result содержит два объекта - err с номером ошибки и
        // объект-строку desc с описанием ошибки. Если ошибки нет (err==0), то
        // помимо err,  result содержит три объекта: usr_results с достижениями данного
        // пользователя на каждом уровне, объект lvl_lead с перечнем лидеров уровней и
        // объект game_lead с данными о лидере игры. Если данные для какого-то из этих
        // объектов на сервере получить не получилось, то объект будет содержать номер
        // ошибки err и её описание desc 
        if (('err' in result) && (result.err == 0)) {
            if (('usr_results' in result) && ('err' in result['usr_results']) &&
                (result['usr_results']['err'] == 0)) {
                this.usrResults = result['usr_results'];
                if ('bonus_arr' in this.usrResults) {
                    this.usrResults.bonus_arr = JSON.parse(this.usrResults['bonus_arr']);
                }
                this.isUsrResultsLoaded = true;
            }
            else {
                try {
                    this.usrResults = {};
                    this.usrResults['err'] = result['usr_results']['err'];

                    // если пользователь с таким id на сервере не найден,
                    // в result['usr_results']['err'] возвращается значение -7,
                    // тогда заполняем на клиенте this.usrResults данными как для
                    // самой первой игры данного пользователя
                    if (this.usrResults['err'] == -7) {
                        this.usrResults['lvl_1'] = 0;
                        for (let i = 2; i < 11; i++) {
                            this.usrResults['lvl_' + i] = -1;
                        }
                    }
                    this.usrResults['desc'] = result['usr_results']['desc'];
                    this.usrResults['bonus_arr'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    this.isUsrResultsLoaded = true;
                }
                catch
                {
                    this.usrResults = {};
                    this.usrResults['err'] = -12;
                    this.usrResults['desc'] = " Client side error.";
                    this.isUsrResultsLoaded = false;
                }

            }

            if (('usr_rating' in result) && ('err' in result['usr_rating']) &&
                (result['usr_rating']['err'] == 0)) {
                this.usrRating = result['usr_rating'];
                this.isUsrRatingLoaded = true;
            }
            else {
                try {
                    this.usrRating = {};
                    this.usrRating['err'] = result['usr_rating']['err'];

                    // если пользователь с таким id на сервере не найден,
                    // в result['usr_rating']['err'] возвращается значение -7,
                    // тогда присваиваем на клиенте this.usrRating "Нет данных"
                    if (this.usrRating['err'] == -7) {
                        this.usrRating['res'] = 0;
                    }
                    this.usrRating['desc'] = result['usr_rating']['desc'];
                    this.isUsrRatingLoaded = true;
                }
                catch {
                    this.usrRating = {};
                    this.usrRating['err'] = -12;
                    this.usrRating['desc'] = " Client side error.";
                    this.isUsrRatingLoaded = false;
                }
            }

            if (('game_lead' in result) && ('err' in result['game_lead']) &&
                (result['game_lead']['err'] == 0)) {
                this.gameLead['res'] = result['game_lead']['res'];
                this.isGameLeadLoaded = true;
            }
            else {
                try {
                    this.gameLead['err'] = result['game_lead']['err'];
                    this.gameLead['desc'] = result['game_lead']['desc'];
                    this.isGameLeadLoaded = false;
                }
                catch
                {
                    this.gameLead = {};
                    this.gameLead['err'] = -12;
                    this.gameLead['desc'] = " Client side error.";
                    this.isGameLeadLoaded = false;
                }
            }
        }
        else {
            this.isUsrRatingLoaded = false;
            this.isGameLeadLoaded = false;
            this.isUsrResultsLoaded = false;
        }
    }

    create(scene)
    {
        this.myGB=new GameBoard(scene);
        window.myManager.myGB.clearLvlInfo();
        if(window.myManager.selectedLvl==0){
            window.myManager.myGB.startIntro();
        }
        else{
            window.myManager.myGB.startLevel(window.myManager.selectedLvl);
        }
        
        //this.myGB.showLvlInfo(this.selectedLvl);
    }

    startWndHandler(evt)
    {
        let a=evt.target.parentElement;
        if(evt.target.tagName=="BUTTON")
        {
            // нажата кнопка "Начать игру" в самом первом диалоговом окне this.startWnd,
            // появляющемся при запуске игры, при этом окно this.startWnd скрывается и
            // появляется окно для выбора уровней this.levelTab
            if(evt.target.id=='startGameBtn')
            {
                this.startWnd.visible=false; 
                let tdId, balls;
                for(let i=1;i<11;i++)
                {
                    tdId='balls'+i;
                    // в массиве this.lvlsDataArr находятся данные о достижениях игрока -
                    // количество набранных баллов или, если уровень недоступен, то -1
                    // если уровень недоступен, записываем в таблицу значение 0
                    balls=this.lvlsDataArr[i]>0?this.lvlsDataArr[i]:0;
                    this.levelTab.getChildByID(tdId).innerHTML=balls;

                    this.levelTab.getChildByID('lvlBest'+i).innerHTML=
                        this.lvlLeadArr[i].balls;
                }
                this.levelTab.visible=true;
                //this.levelTab.setInteractive();
                return;
            }

            // нажата кнопка "Отмена" в диалоговом окне this.levelTab, содержащем
            // список уровней, при нажатии кнопки "Отмена", данное окно скрывается и
            // появляется окно this.startWnd 
            if(evt.target.id=='escLvlTab')
            {
                this.startWnd.visible=true; 
                this.levelTab.visible=false;
                return;
            }

            // если нажата одна из кнопок в таблице выбора уровней в окне this.levelTab,
            // то определяем номер уровня, указанный на кнопке и вызываем метод
            // this.myGB.showLvlInfo с номером выбранного уровня
            if(evt.target.parentElement.tagName=='TD')
            {
                let str=evt.target.id.substring(1);
                let numLvl=Number.parseInt(str);
                this.levelTab.visible=false;
                this.levelInfo.getChildByID('numLvl').innerHTML=numLvl;
                this.levelInfo.getChildByID('lvlLeader').innerHTML=
                    this.lvlLeadArr[numLvl].name;
                this.levelInfo.getChildByID('leaderBalls').innerHTML=
                    this.lvlLeadArr[numLvl].balls;
                this.levelInfo.getChildByID('lvlInfo').innerHTML=
                    this.myGB.levelsArr[0][numLvl];
                this.levelInfo.visible=true;
                this.myGB.showLvlInfo(numLvl);
                return;
            }

            if(evt.target.id=='escLvlInfo')
            {
                this.levelInfo.visible=false; 
                this.levelTab.visible=true;
                this.myGB.clearLvlInfo();
                return;
            }

            if(evt.target.id=='startLevel')
            {
                let nLvl=this.levelInfo.getChildByID('numLvl').innerHTML;

                if(this.levelInfo)
                {
                    this.levelInfo.removeAllListeners();
                    this.levelInfo.destroy();
                }

                if(this.levelTab)
                {
                    this.levelTab.removeAllListeners();
                    this.levelTab.destroy();
                }

                if(this.startWnd)
                {
                    this.startWnd.removeAllListeners();
                    this.startWnd.destroy();
                }

                this.myGB.clearLvlInfo();
                // если this.isDebut==true, то игра будет сопровождаться подсказками
                this.myGB.startLevel(nLvl,this.isDebut);
                return;
            }
        }
    }

    // этод метод вызывается при завершении уровня из класса App и
    // получает в качестве аргумента объект пользовательского события
    // CustomEvent("resumeLvl"..., которое обрабатывается методом onCompleteLevel
    // объекта App. resumeLevel(), который и вызывает resumeLevel
    // resumeLevel заносит при необходимости новое значение в lvlsData и возвращает
    // строку titleStr, которую App выведет в диалоговом окне 
    
    // isCompleted=true, если уровень пройден, false в противном случае 
    resumeLevel(isCompleted)
    {
        // строка сообщений для диалогового окна vkui
        let titleStr;

        // номер текущего уровня
        let numLvl=this.myGB.currentLvl;

        // количество набранных баллов на текущем уровне this.myGB.currentLvl
        let balance=this.myGB.balance;

        // максимально возможный результат
        let maxPossible=this.myGB.levelsArr[numLvl].numBal*5;

        

        // массив с ходами игрока
        this.userData.solution=this.myGB.movesArr;
        this.userData.numLvl=numLvl;
        this.userData.balance=balance;

        // если уровень пройден впервые или улучшен предыдущий результат
        // на этом уровне, пытаемся сохранить результат на сервере
        if(isCompleted && (balance<=this.usrResults['lvl_'+numLvl]))
        {
            this.setGameData();
        }

        // если уровень пройден
        if(isCompleted)
        {
            // если прежде уровень не проходился, то открываем ещё один
            // уровень, наименьший из закрытых
            if(this.usrResults['lvl_'+numLvl]==0)
            { 
                //this.lvlsData.def[numLvl]=balance;
                let nextLvl=-1;
            
                // если был открыт ещё один уровень
                if(nextLvl!=-1)
                {
                    // если показан максимально возможный результат
                    if(balance==maxPossible)
                    {
                        titleStr="Поздравляем! Вы прошли уровень "+numLvl+ 
                            " с максимальным результатом и становитесь лидером уровня !";
                            //" Теперь вам доступен уровень "+nextLvl+"!";
                    }
                    else
                    {
                        titleStr="Поздравляем! Вам удалось пройти уровень "+numLvl+ " !";
                            //" Теперь вам доступен уровень "+nextLvl+"!";
                    }
                }
            }
            // если уровень был уже ранее пройден
            else
            {
                // если прежний результат улучшен
                if(balance > this.usrResults['lvl_'+numLvl])
                {
                    // если уровень пройден впервые или улучшен предыдущий результат
                    // на этом уровне, пытаемся сохранить результат на сервере
                    //this.setGameData();
                    //this.lvlsData.def[numLvl]=balance;
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
                    //this.lvlsData.def[numLvl]=balance;
                    titleStr="Поздравляем! Вы прошли уровень "+numLvl+ 
                    " с максимальным результатом и становитесь лидером уровня !";
                }
            }
        }
        // если уровень не пройден
        else
        {
            titleStr="Вам, к сожалению, не удалось пройти уровень "+numLvl+ 
                ", но Вы можете попытаться сделать это ещё раз.";
        }
    }

    // обработчик нажатий кнопок "Повторить" и "Отмена" в окне endLvlWndHandler
    endLvlWndHandler(evt)
    {
        if(evt.target.tagName=="BUTTON")
        {
            // нажата кнопка "Повторить" в самом первом диалоговом окне this.endLvlWnd,
            // появляющемся при завершении уровня
            if(evt.target.id=='restartLvl')
            {
                this.endLvlWnd.visible=false; 
                this.endLvlWnd.destroy();
                this.myGB.replayLevel();
                return;
            }

            if(evt.target.id=='finishLvl')
            {
                this.endLvlWnd.visible=false; 
                this.endLvlWnd.destroy();
                this.myGB.clearGB();
                this.create();
                this.startWnd.visible=false;
                this.levelTab.visible=true; 
                return;
            }
        }
    }

    // получает данные о достижениях пользователя и о лидерах
    async setGameData(e)
    {
        let userData={};
        let json;
        let str=window.location.href;
        let url=new URL(str);
        let params = new URL(str).searchParams;

        for(let [name, value] of url.searchParams) 
        {
            userData[name]=value;
        }

        userData.source="vk";
        userData.solution=this.myGB.movesArr;
        userData.numLvl=this.myGB.currentLvl;
        userData.balance=this.myGB.balance;
        userData.numBalls=this.myGB.levelsArr[userData.numLvl].numBal;
        if((this.userInfo!=null)&&(typeof(this.userInfo)==='object'))
        {
            if('first_name' in this.userInfo) userData.first_name=this.userInfo.first_name;
            if('last_name' in this.userInfo) userData.second_name=this.userInfo.last_name;
        }

        let resStr='userData='+JSON.stringify(userData);

        //let response= await fetch('http://localhost/tutor1Server/php/set_lvl_lead.php',
        let response= await fetch('https://galogame.ru/php/set_lvl_lead.php',
            {method: 'post',
            headers: {
                'Content-Type':'application/x-www-form-urlencoded',
                //'Origin':'https://localhost/tutor1'
            },
            body:('userData='+JSON.stringify(userData))
            });

        if(response.ok)
        {
            json = await response.json();
            if(('err' in json)&&(json['err']==0))
            {
                if(('usr_results' in json)&&('err' in json['usr_results'])
                    &&(json['usr_results']['err']==0))
                {
                    this.usrResults=json['usr_results'];
                    this.isUsrResultsLoaded=true;
                    this.usrResults['bonus_arr'] = JSON.parse(this.usrResults['bonus_arr'])

                }
                if(('game_lead' in json)&&('err' in json['game_lead'])&&
                    (json['game_lead']['err']==0))
                {
                    this.gameLead=json['game_lead'];
                    this.isGameLeadLoaded=true;
                }
                if(('usr_rating' in json)&&('err' in json['usr_rating'])&&
                    (json['usr_rating']['err']==0))
                {
                    this.usrRating['err']=json['usr_rating']['err'];
                    this.usrRating['res']=json['usr_rating']['res'];
                    this.isUsrRatingLoaded=true;
                }
            }
        }
        else
        {
            let b=0;
        }
        
        // данные о лидерах уровня пытаемся сначала получить из хранилища,
        // а, если данных в хранилище нет, то присваиваем значения, которые
        // пользователь видит при самом первом входе в игру. Присвоенные значения
        // будут актуальны до получения данных с сервера.
        if(window.localStorage!=undefined)
        {
            // данные о лидерах уровней в json формате
            let jsLvlLeadData=0;
            // ищем данные в локальном хранилище
            jsLvlLeadData=window.localStorage.getItem('jsLvlLeadData');
            if(jsLvlLeadData)
            {
                // если данные в хранилище имеются, но не удалось их распарсить,
                // снова обнуляем jsLvlLeadData
                try
                {
                    this.lvlLeadArr=JSON.parse(jsLvlLeadData);
                }
                catch(err)
                {
                    jsLvlLeadData=0;
                }
            }
            // если по какой-либо причине jsLvlLeadData оказался незаполненным
            // заполняем его значениями, которые игрок видит при самом первом входе
            if(!jsLvlLeadData)
            {
                this.lvlLeadArr=[{'date':Date.now()},{name:'Автор',balls:0},{name:'Автор',balls:0},
                {name:'Автор',balls:0},{name:'Автор',balls:0},{name:'Автор',balls:0},
                {name:'Автор',balls:0},{name:'Автор',balls:0},{name:'Автор',balls:0},
                {name:'Автор',balls:0},{name:'Автор',balls:0}];
            }
        }
        // если хранилище недоступно, то опять-таки присваиваем значение по-умолчанию
        else
        {
            this.lvlLeadArr=[{'date':Date.now()},{name:'Автор',balls:0},{name:'Автор',balls:0},
                {name:'Автор',balls:0},{name:'Автор',balls:0},{name:'Автор',balls:0},
                {name:'Автор',balls:0},{name:'Автор',balls:0},{name:'Автор',balls:0},
                {name:'Автор',balls:0},{name:'Автор',balls:0}];
        }

        // достижения пользователя по уровням получаем по тому же алгоритму, что и
        // данные для this.lvlLeadArr: сначала пытаемся из localStorage, если не удалось,
        // то присваиваем значение по умолчанию и ждём результата асинхронного ответа с
        // актуальными данными
        if(window.localStorage!=undefined)
        {
            // данные о лидерах уровней в json формате
            let jslvlsDataArr=0;
            // ищем данные в локальном хранилище
            jslvlsDataArr=window.localStorage.getItem('jslvlsDataArr');
            if(jslvlsDataArr)
            {
                // если данные в хранилище имеются, но не удалось их распарсить,
                // снова обнуляем jsLvlLeadData
                try
                {
                    this.lvlsDataArr=JSON.parse(jslvlsDataArr);
                }
                catch(err)
                {
                    jslvlsDataArr=0;
                }
            }
            // если по какой-либо причине jsLvlLeadData оказался незаполненным
            // заполняем его значениями, которые игрок видит при самом первом входе
            if(!jslvlsDataArr)
            {
                this.lvlsDataArr=[Date.now(),0,0,0,-1,-1,-1,-1,-1,-1,-1];
            }
        }
        else
        {
            this.lvlsDataArr=[Date.now(),0,0,0,-1,-1,-1,-1,-1,-1,-1];
        }
    }
}