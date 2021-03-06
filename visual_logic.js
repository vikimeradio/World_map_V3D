/**
 * Generated by Verge3D Puzzles v.3.9.1
 * Mon Jun 13 2022 23:20:26 GMT+0300
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */

'use strict';

(function() {

// global variables/constants used by puzzles' functions

var LIST_NONE = '<none>';

var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.pickedObject = '';
_pGlob.hoveredObject = '';
_pGlob.mediaElements = {};
_pGlob.loadedFile = '';
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.openedFile = '';
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.intervalTimers = {};

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.colorTmp = new v3d.Color();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();

var PL = v3d.PL = v3d.PL || {};

// a more readable alias for PL (stands for "Puzzle Logic")
v3d.puzzles = PL;

PL.procedures = PL.procedures || {};




PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;
    // app is more conventional than appInstance (used in exec script and app templates)
    var app = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    var PROC = {
    
};


    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

// app is more conventional than appInstance (used in exec script and app templates)
var app = appInstance;

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}



var PROC = {
    
};

var Ann;


// createCSSRule puzzle
function createCSSRule(cssRule, cssRuleCont, isParent) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssRule + ' { ' + cssRuleCont + ' } ';

    var styles = (isParent) ? parent.document.getElementsByTagName('head')[0] :
                              document.getElementsByTagName('head')[0];
    styles.appendChild(style)
}



// autoRotateCamera puzzle
function autoRotateCamera(enabled, speed) {

    if (appInstance.controls && appInstance.controls instanceof v3d.OrbitControls) {
        appInstance.controls.autoRotate = enabled;
        appInstance.controls.autoRotateSpeed = speed;
    } else {
        console.error('autorotate camera: Wrong controls type');
    }
}



// setTimer puzzle
function registerSetTimer(id, timeout, callback, repeat) {

    if (id in _pGlob.intervalTimers) {
        window.clearInterval(_pGlob.intervalTimers[id]);
    }

    _pGlob.intervalTimers[id] = window.setInterval(function() {
        if (repeat-- > 0) {
            callback(_pGlob.intervalTimers[id]);
        }
    }, 1000 * timeout);
}




// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return obj.type !== 'AmbientLight' &&
           obj.name !== '' &&
           !(obj.isMesh && obj.isMaterialGeneratedMesh) &&
           !obj.isAuxClippingMesh;
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime) {
                _pGlob.objCache[objName] = objFound;
            }
        }
    });
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc.filter(function(name) {
        return name;
    });
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}




// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart, mouseButtons) {

    var elem = appInstance.renderer.domElement;
    elem.addEventListener(eventType, pickListener);
    if (v3d.PL.editorEventListeners)
        v3d.PL.editorEventListeners.push([elem, eventType, pickListener]);

    if (eventType == 'mousedown') {

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, pickListener);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, pickListener]);

    } else if (eventType == 'dblclick') {

        var prevTapTime = 0;

        function doubleTapCallback(event) {

            var now = new Date().getTime();
            var timesince = now - prevTapTime;

            if (timesince < 600 && timesince > 0) {

                pickListener(event);
                prevTapTime = 0;
                return;

            }

            prevTapTime = new Date().getTime();
        }

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, doubleTapCallback);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, doubleTapCallback]);
    }

    var raycaster = new v3d.Raycaster();

    function pickListener(event) {

        // to handle unload in loadScene puzzle
        if (!appInstance.getCamera())
            return;

        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            if (mouseButtons && mouseButtons.indexOf(event.button) == -1)
                return;
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.getCamera(true));
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList);
        callback(intersects, event);
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered, whenDraggedOver, and raycast puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



// whenClicked puzzle
function registerOnClick(objSelector, xRay, doubleClick, mouseButtons, cbDo, cbIfMissedDo) {

    // for AR/VR
    _pGlob.objClickInfo = _pGlob.objClickInfo || [];

    _pGlob.objClickInfo.push({
        objSelector: objSelector,
        callbacks: [cbDo, cbIfMissedDo]
    });

    initObjectPicking(function(intersects, event) {

        var isPicked = false;

        var maxIntersects = xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);
            var objNames = retrieveObjectNames(objSelector);

            if (objectsIncludeObj(objNames, objName)) {
                // save the object for the pickedObject block
                _pGlob.pickedObject = objName;
                isPicked = true;
                cbDo(event);
            }
        }

        if (!isPicked) {
            _pGlob.pickedObject = '';
            cbIfMissedDo(event);
        }

    }, doubleClick ? 'dblclick' : 'mousedown', false, mouseButtons);
}



// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != 'CONTAINER' && ids[0] != 'WINDOW' &&
        ids[0] != 'DOCUMENT' && ids[0] != 'BODY' && ids[0] != 'QUERYSELECTOR') {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == 'CONTAINER') {
        if (appInstance !== null) {
            elem = appInstance.container;
        } else if (typeof _initGlob !== 'undefined') {
            // if we are on the initialization stage, we still can have access
            // to the container element
            var id = _initGlob.container;
            if (isParent) {
                elem = parent.document.getElementById(id);
            } else {
                elem = document.getElementById(id);
            }
        }
    } else if (Array.isArray(id) && id[0] == 'WINDOW') {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == 'DOCUMENT') {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == 'BODY') {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else if (Array.isArray(id) && id[0] == 'QUERYSELECTOR') {
        if (isParent)
            elem = parent.document.querySelector(id);
        else
            elem = document.querySelector(id);
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}



// setHTMLElemStyle puzzle
function setHTMLElemStyle(prop, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem || !elem.style)
            continue;
        elem.style[prop] = value;
    }
}



// eventHTMLElem puzzle
function eventHTMLElem(eventType, ids, isParent, callback) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem)
            continue;
        elem.addEventListener(eventType, callback);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, eventType, callback]);
    }
}



/**
 * Obtain a unique name from the given one. Names are tested with the given
 * callback function that should return a boolean "unique" flag. If the given
 * "name" is not considered unique, then "name2" is tested for uniqueness, then
 * "name3" and so on...
 */
function acquireUniqueName(name, isUniqueCb) {
    var uniqueName = name;

    if (isUniqueCb !== undefined) {
        while (!isUniqueCb(uniqueName)) {
            var r = uniqueName.match(/^(.*?)(\d+)$/);
            if (!r) {
                uniqueName += "2";
            } else {
                uniqueName = r[1] + (parseInt(r[2], 10) + 1);
            }
        }
    }

    return uniqueName;
}



/**
 * Check if the given material name is already used by materials on the scene.
 */
function matNameUsed(name) {
    return v3d.SceneUtils.getMaterialByName(appInstance, name) !== null;
}



// assignMaterial puzzle
function assignMat(objSelector, matName) {
    var objNames = retrieveObjectNames(objSelector);
    if (!matName)
        return;
    var mat = v3d.SceneUtils.getMaterialByName(appInstance, matName);
    if (!mat)
        return;
    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName)
            continue;
        var obj = getObjectByName(objName);
        if (obj) {
            var firstSubmesh = obj.resolveMultiMaterial()[0];

            var influences = firstSubmesh.morphTargetInfluences;
            var hasMorphing = influences !== undefined && influences.length > 0;

            if (hasMorphing) {
                var newMat = mat.clone();
                newMat.name = acquireUniqueName(mat.name, function(name) {
                    return !matNameUsed(name);
                });

                if (hasMorphing) {
                    newMat.morphTargets = true;
                    if (firstSubmesh.geometry.morphAttributes.normal !== undefined) {
                        newMat.morphNormals = true;
                    }
                }

                firstSubmesh.material = newMat;
            } else {
                firstSubmesh.material = mat;
            }
        }
    }
}



function findUniqueObjectName(name) {
    function objNameUsed(name) {
        return Boolean(getObjectByName(name));
    }
    while (objNameUsed(name)) {
        var r = name.match(/^(.*?)(\d+)$/);
        if (!r) {
            name += "2";
        } else {
            name = r[1] + (parseInt(r[2], 10) + 1);
        }
    }
    return name;
}



// addAnnotation and removeAnnotation puzzles
function handleAnnot(add, annot, objSelector, contents, id, name) {
    var objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName)
            continue;
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        // check if it already has an annotation and remove it
        for (var j = 0; j < obj.children.length; j++) {
            var child = obj.children[j];
            if (child.type == "Annotation") {
                // delete all childs of annotation
                child.traverse(function(child2) {
                    if (child2.isAnnotation)
                        child2.dispose();
                    });
                obj.remove(child);
            }
        }
        if (add) {
            var aObj = new v3d.Annotation(appInstance.container, annot, contents);
            aObj.name = findUniqueObjectName(name ? name : annot);
            aObj.fadeObscured = _pGlob.fadeAnnotations;
            if (id) {
                aObj.annotation.id = id;
                aObj.annotationDialog.id = id+'_dialog';
            }
            obj.add(aObj);
        }
    }
}



Ann;

Ann = true;

createCSSRule('annotation-dialog', 'top: 0;', false);

registerSetTimer('autorotate', 10, function() {
  autoRotateCamera(true, 2);
}, Infinity);
registerOnClick(['ALL_OBJECTS'], false, false, [0,1,2], function() {
  autoRotateCamera(false, 2);
  registerSetTimer('autorotate', 10, function() {
    autoRotateCamera(true, 2);
  }, Infinity);
}, function() {});
eventHTMLElem('click', 'Hide_btn', true, function(event) {
  setHTMLElemStyle('display', 'none', ['ru', 'au', 'bel', 'bra', 'UK', 'can', 'chi', 'fra', 'ger', 'ind', 'jap', 'kaz', 'mon', 'pol', 'spa', 'ua', 'usa'], false);
});
eventHTMLElem('click', 'Show_btn', true, function(event) {
  if (Ann == true) {
    setHTMLElemStyle('display', 'block', ['ru', 'au', 'bel', 'bra', 'UK', 'can', 'chi', 'fra', 'ger', 'ind', 'jap', 'kaz', 'mon', 'pol', 'spa', 'ua', 'usa'], false);
  }
});

eventHTMLElem('click', 'Swap_btn', true, function(event) {
  assignMat('earth', 'better.001');
  Ann = false;
  setHTMLElemStyle('display', 'none', ['ru', 'au', 'bel', 'bra', 'UK', 'can', 'chi', 'fra', 'ger', 'ind', 'jap', 'kaz', 'mon', 'pol', 'spa', 'ua', 'usa'], false);
});
eventHTMLElem('click', 'Pol_btn', true, function(event) {
  Ann = true;
  assignMat('earth', 'Материал');
  setHTMLElemStyle('display', 'block', ['ru', 'au', 'bel', 'bra', 'UK', 'can', 'chi', 'fra', 'ger', 'ind', 'jap', 'kaz', 'mon', 'pol', 'spa', 'ua', 'usa'], false);
});

handleAnnot(true, '1', 'Russia', 'Росси́я, или Росси́йская Федера́ция (РФ) — государство в Восточной Европе и Северной Азии. Территория России в её конституционных границах составляет 17 125 191 км²; население страны (в пределах её заявленной территории) составляет 145 557 576 чел. (2022). Занимает первое место в мире по территории, шестое — по объёму ВВП по ППС и девятое — по численности населения. Столица — Москва. Государственный язык на всей территории страны — русский', 'ru', undefined);
handleAnnot(true, '2', 'Australia', 'Австралия – государство в Южном полушарии, на материке Австралия (единственное в мире, занимающее целый материк), острове Тасмания и мелких прибрежных островах (Мелвилл, Грут-Айленд, Кенгуру, Батерст, Флиндерс, Кинг и др.). Площадь 7,7 млн. км2. Население 23,9 млн. чел. (2015). Столица – Канберра. Официальный язык – английский. Денежная единица – австралийский доллар. Административно-территориальное деление: 6 штатов и 3 внутренние территории (табл. 1). В состав А. также входят 7 внешних территорий (владений): в Индийском океане – Остров Рождества, Кокосовые Острова, Острова Ашмор и Картье, Острова Херд и Мак-Дональд (последние две территории – необитаемые); в Тихом океане – Остров Норфолк и Острова Кораллового моря (последняя территория – необитаемая); Австралийская антарктическая территория (необитаемая).', 'au', undefined);
handleAnnot(true, '3', 'Belarus', 'Белоруссия – государство в Восточной Европе. Расположено в западной части Восточно-Европейской равнины. Граничит на востоке с Россией, на юге с Украиной, на западе с Польшей, на северо-западе с Литвой, на севере с Латвией. Площадь 207,6 тыс. км2. Население 9413,4 тыс. чел. (2019, перепись). Столица – Минск. Денежная единица – белорусский рубль. Официальные языки – белорусский и русский. Административно-территориальное деление: 6 областей и город Минск (таблица 1). Области разделены на 118 районов и 10 городов областного подчинения.', 'bel', undefined);
handleAnnot(true, '4', 'Brazil', 'Бразилия – государство в Латинской Америке. Занимает центральную и восточную части материка Южная Америка. Граничит на севере с Венесуэлой, Гайаной, Суринамом и Французской Гвианой, на северо-западе – с Колумбией, на западе – с Перу и Боливией, на юго-западе – с Парагваем и Аргентиной, на юге – с Уругваем (общая длина сухопутных границ около 16 тыс. км). На востоке омывается Атлантическим океаном (протяжённость береговой линии 7,4 тыс. км), в его акватории Б. принадлежат архипелаги Фернанду-ди-Норонья, Триндади (Тринидад-э-Мартин-Вас), Сан-Паулу (Сан-Педру-э-Сан-Паулу) и атолл Рокас. Б. – одно из крупнейших государств мира по площади территории и численности населения (5-е место по обоим показателям, 2014) и самое крупное в Латинской Америке. Площадь 8502,7 тыс. км2. Население 204,4 млн. человек (2015). Столица – Бразилиа. Официальный язык – португальский. Денежная единица – бразильский реал. Административно-территориальное деление: 26 штатов и Федеральный округ ', 'bra', undefined);
handleAnnot(true, '5', 'British', 'Великобритания - – государство в северо-западной части Европы. Расположено на Британских островах, отделённых от континента проливами Ла-Манш (Английский канал) и Па-де-Кале (Дуврский пролив); занимает остров Великобритания, северо-восточную часть острова Ирландия и ряд небольших островных групп (Гебридские острова, Оркнейские острова, Шетландские острова, острова Силли и др.) и островов (острова Уайт, острова Англси и др.). Омывается водами Атлантического океана и его морей – Северного (на востоке острова Великобритания) и Ирландского (между островами Великобритания и Ирландия); протяжённость береговой линии 12429 км, по суше граничит с государством Ирландия (длина границы 360 км).', 'UK', undefined);
handleAnnot(true, '6', 'Canada', 'Канада го­су­дар­ст­во в Сев. Аме­ри­ке. За­ни­ма­ет сев. часть Сев. Аме­ри­ки и мно­го­числ. при­ле­гаю­щие ост­ро­ва, в т. ч. Ван­ку­вер, Ко­ро­ле­вы Шар­лот­ты (на за­па­де), Ка­над­ский Арк­ти­че­ский ар­хи­пе­лаг (на се­ве­ре), Нью­фа­унд­ленд, Ан­ти­кос­ти, Прин­ца Эду­ар­да (на юго-вос­то­ке). На юго-за­па­де омы­ва­ет­ся Ти­хим ок., на се­ве­ре – Сев. Ле­до­ви­тым ок. и его мо­рем Бо­фор­та, на вос­то­ке – Ат­лан­ти­че­ским ок., его мо­ря­ми Баф­фи­на и Лаб­ра­дор, а так­же Гуд­зо­но­вым зал. Дли­на бе­ре­го­вой ли­нии св. 243 тыс. км (вклю­чая по­бе­ре­жья ост­ро­вов; са­мая про­тя­жён­ная в ми­ре). На юге и се­ве­ро-за­па­де име­ет су­хо­пут­ную гра­ни­цу с США (про­тя­жён­ность 8,9 тыс. км, в т. ч. ок. 2,5 тыс. км – гра­ни­ца со шта­том Аля­ска).', 'can', undefined);
handleAnnot(true, '7', 'China', 'Китай – го­су­дар­ст­во в Вост. и Центр. Азии. На вос­то­ке и юго-вос­то­ке омы­ва­ет­ся во­да­ми Жёл­то­го, Во­сточ­но-Ки­тай­ско­го и Юж­но-Ки­тай­ско­го мо­рей Ти­хо­го ок. (про­тя­жён­ность бе­ре­го­вой ли­нии св. 18 тыс. км); у по­бе­ре­жья мно­го­числ. ост­ро­ва (круп­ней­шие – Тай­вань и Хай­нань). Дли­на су­хо­пут­ных гра­ниц ок. 22,8 тыс. км. На се­ве­ро-вос­то­ке гра­ни­чит с КНДР и Рос­си­ей, на се­ве­ре – с Мон­го­ли­ей, на се­ве­ро-за­па­де – с Рос­си­ей, Ка­зах­ста­ном и Кир­ги­зи­ей, на за­па­де – с Та­д­жи­ки­ста­ном и Аф­га­ни­ста­ном, а так­же с Па­ки­ста­ном (по т. н. ли­нии кон­тро­ля в Каш­ми­ре), на юго-за­па­де и юге – с Ин­ди­ей, Не­па­лом и Бу­та­ном; на юго-вос­то­ке – с Мьян­мой, Лао­сом и Вьет­на­мом.', 'chi', undefined);
handleAnnot(true, '8', 'France', 'Франция – го­су­дар­ст­во в Зап. Ев­ро­пе. В его со­став вхо­дят мет­ро­по­лия Фран­ция (France métropolitaine; тер­ри­то­рия в Ев­ро­пе, с о. Кор­си­ка и др. ост­ро­ва­ми; да­лее Ф.) и 13 за­мор­ских вла­де­ний (5 за­мор­ских ре­гио­нов – Гва­де­лу­па, Гвиа­на и Мар­ти­ни­ка в Лат. Аме­ри­ке, Май­от­та и Ре­юнь­он в Аф­ри­ке; 5 за­мор­ских со­об­ществ – Сен-Бар­тель­ми и Сен-Мар­тен в Лат. Аме­ри­ке, Сен-Пьер и Ми­ке­лон в Сев. Аме­ри­ке, Франц. По­ли­не­зия и Уол­лис и Фу­ту­на в Океа­нии; осо­бое адм.-терр. об­ра­зо­ва­ние Но­вая Ка­ле­до­ния в Океа­нии; 2 за­мор­ских осо­бых адм.-терр. об­ра­зо­ва­ния – Франц. Юж­ные и Ан­тарк­тич. Тер­ри­то­рии в Ин­дий­ском ок. и Клип­пер­тон в Ти­хом ок.). Ф. на за­па­де омы­ва­ет­ся Бис­кай­ским зал., на се­ве­ро-за­па­де – про­ли­ва­ми Ла-Манш и Па-де-Ка­ле, на се­ве­ре – Се­вер­ным м., на юге – Сре­ди­зем­ным м. (дли­на бе­ре­го­вой ли­нии 3427 км). Гра­ни­чит на се­ве­ро-вос­то­ке с Бель­ги­ей, Люк­сем­бур­гом и Гер­ма­ни­ей, на вос­то­ке с Гер­ма­ни­ей и Швей­ца­ри­ей, на юго-вос­то­ке с Ита­ли­ей и Мо­на­ко, на юго-за­па­де с Ис­па­ни­ей и Ан­дор­рой. Пл. 544,0 тыс. км2 (с учё­том за­мор­ских вла­де­ний 643,8 тыс. км2). Нас. 64,5 млн. чел. (2016, оцен­ка; св. 66,5 млн. чел.). Офиц. язык – фран­цуз­ский. Де­неж­ная еди­ни­ца – ев­ро. Сто­ли­ца – Па­риж. Адм.-терр. де­ле­ние мет­ро­по­лии Фран­ция: 13 ре­гио­нов (с 2016; табл. 1), в их со­ста­ве 96 де­пар­та­мен­тов и Ли­он­ская гор. мет­ро­по­лия.', 'fra', undefined);
handleAnnot(true, '9', 'Germany', 'Германия – го­су­дар­ст­во в Центр. Ев­ро­пе. На се­ве­ро-за­па­де омы­ва­ет­ся Се­вер­ным морем, на се­ве­ро-вос­то­ке – Бал­тий­ским морем (дли­на бе­ре­го­вой ли­нии 2389 км). На за­па­де Г. гра­ни­чит с Фран­ци­ей, Люк­сем­бур­гом, Бель­ги­ей и Ни­дер­лан­да­ми, на се­ве­ре – с Да­ни­ей, на вос­то­ке – с Поль­шей и Че­хи­ей, на юге – с Ав­ст­ри­ей и Швей­ца­ри­ей. Про­тя­жён­ность су­хо­пут­ных гра­ниц 3621 км. Пл. 357,6 тыс. км2 (из них внутр. ак­ва­то­рии 8,4 тыс. км2). Нас. 83,2 млн. чел. (2019; круп­ней­шая по чис­лу жи­те­лей стра­на Зарубежной Ев­ро­пы). Сто­ли­ца – Бер­лин. Официальный язык – не­мец­кий. Де­неж­ная еди­ни­ца – ев­ро. Г. – фе­де­ра­тив­ное го­су­дар­ст­во в со­ста­ве 16 фе­де­раль­ных зе­мель', 'ger', undefined);
handleAnnot(true, '10', 'India', 'Индия – го­су­дар­ст­во в Юж. Азии. Омы­ва­ет­ся во­да­ми Ин­дий­ско­го ок.: на за­паде – Ара­вий­ским м., на юго-за­па­де – Лак­ка­див­ским м., на вос­то­ке – Бен­галь­ским зал.; на юге Ман­нар­ский зал. и Пол­к­ский прол. от­де­ля­ют И. от о. Шри-Лан­ка. Гра­ни­чит на се­ве­ро-за­па­де с Па­ки­ста­ном и Аф­га­ни­ста­ном, на се­ве­ре с Ки­та­ем, Не­па­лом и Бу­та­ном, на вос­то­ке с Мьян­мой и Банг­ла­деш. В со­став И. вхо­дят Лак­ка­див­ские о-ва (со­юз­ная тер­ри­то­рия Лак­шад­вип), Ан­да­ман­ские и Ни­ко­бар­ские о-ва. Пл. 3287,6 тыс. км2 (2,4% оби­тае­мой су­ши; 7-е ме­сто в ми­ре); макс. про­тя­жён­ность с се­ве­ра на юг св. 3210 км, с за­па­да на вос­ток св. 2930 км. По чис­лен­но­сти на­се­ле­ния (1129,7 млн. чел.) за­ни­ма­ет 2-е ме­сто в ми­ре по­сле Ки­тая (17,1% нас. Зем­ли; 2007). Сто­ли­ца – Нью-Де­ли (вхо­дит в со­став Нац. сто­лич­ной тер­ри­то­рии Де­ли). Офиц. язы­ки – хин­ди и анг­лий­ский. Де­неж­ная еди­ни­ца – ин­дий­ская ру­пия. В адм. от­но­ше­нии тер­ри­то­рия И. со­сто­ит из 28 шта­тов, Нац. сто­лич­ной тер­ри­то­рии Де­ли и 6 со­юз­ных тер­ри­то­рий ', 'ind', undefined);
handleAnnot(true, '11', 'Japan', 'Япония – го­су­дар­ст­во в Вост. Азии. Рас­по­ло­же­но на Япон­ских о-вах. Омы­ва­ет­ся Ти­хим ок. и его мо­ря­ми: Япон­ским на за­па­де, Охот­ским на се­ве­ре, Вос­точ­но-Ки­тай­ским на юго-за­па­де (про­тя­жён­ность бе­ре­го­вой ли­нии ок. 29,3 тыс. км). Гра­ни­чит по мо­рю с Рос­си­ей, Ки­та­ем, КНДР и Рес­пуб­ли­кой Ко­рея. Пл. 372,8 тыс. км2 (без спор­ных тер­ри­то­рий; по нац. дан­ным, 377,9 тыс. км2). Нас. 126,9 млн. чел. (2016, оцен­ка; 10-е ме­сто в ми­ре). Сто­ли­ца – То­кио. Офиц. язык – япон­ский. Де­неж­ная еди­ни­ца – япон­ская ие­на. В адм. от­но­ше­нии тер­ри­то­рия Я. де­лит­ся на 47 пре­фек­тур (табл. 1), объ­е­ди­нён­ных в сис­те­му «то­до­фу­кэн» (вклю­ча­ет: сто­лич­ную пре­фек­ту­ру «то» – То­кио; гу­бер­на­тор­ст­во «до» – Хок­кай­до; го­ро­да «фу» со ста­ту­сом пре­фек­тур – Кио­то и Оса­ка; 43 пре­фек­ту­ры «кэн»). Пре­фек­ту­ры со­сто­ят из уез­дов и го­ро­дов, Хок­кай­до – из ок­ру­гов. 20 го­ро­дов с нас. св. 500 тыс. чел. (2015) име­ют спец. ста­тус («го­ро­да, оп­ре­де­лён­ные ука­зом пра­ви­тель­ст­ва»). Я. тра­ди­ци­он­но де­лит­ся на 10 ре­гио­нов: Хок­кай­до, То­хо­ку, Тю­бу, Хо­ку­ри­ку (ино­гда объ­е­ди­ня­ют с Тю­бу), Кан­то, Кин­ки (Кан­сай), Тю­го­ку, Си­ко­ку, Кю­сю, Оки­на­ва (Рю­кю; ино­гда объ­е­ди­ня­ют с Кю­сю).', 'jap', undefined);
handleAnnot(true, '12', 'Kazakhstan', 'Казахстан – го­су­дар­ст­во в центр. час­ти Евр­азии. За­ни­ма­ет сев. часть Центр. Азии; рай­оны пра­во­бе­ре­жья р. Урал на край­нем за­па­де – в пре­де­лах Ев­ро­пы. На севе­ро-за­па­де, се­ве­ре и се­ве­ро-вос­то­ке гра­ни­чит с Рос­си­ей (дли­на гра­ни­цы ок. 7,6 тыс. км), на вос­то­ке – с Ки­та­ем, на юге – с Кир­ги­зи­ей, Уз­бе­ки­ста­ном и Турк­ме­ни­ей; на за­па­де омы­ва­ет­ся во­да­ми Кас­пий­ско­го мо­ря. Пл. 2724,9 тыс. км2 (9-е ме­сто в ми­ре; ок. 1,8% пл. су­ши); про­тя­жён­ность тер­ри­то­рии стра­ны с за­па­да на вос­ток ок. 3000 км, с се­ве­ра на юг – ок. 1600 км. Нас. 15,7 млн. чел. (2008). Сто­ли­ца – Ас­та­на. Де­неж­ная еди­ни­ца – тен­ге. Гос. язык – ка­зах­ский; в гос. уч­ре­ж­де­ни­ях и ор­га­нах ме­ст­но­го са­мо­управ­ле­ния на­рав­не с ка­зах­ским офи­ци­аль­но упот­реб­ля­ет­ся рус. яз. (де­ло­про­из­вод­ст­во в ор­га­нах вла­сти и управ­ле­ния пол­но­стью пе­ре­во­дит­ся на ка­зах. яз.). В адм. от­но­ше­нии тер­ри­то­рия К. со­сто­ит из 14 об­лас­тей и 2 го­ро­дов рес­пуб­ли­кан­ско­го под­чи­не­ния ', 'kaz', undefined);
handleAnnot(true, '13', 'Mongolia', 'Монголия – го­су­дар­ст­во в вост. час­ти Центр. Азии. На се­ве­ре гра­ни­чит с Рос­си­ей, на вос­то­ке, юге и за­па­де – с Ки­та­ем. Пл. 1564,9 тыс. км2. Нас. св. 2,76 млн. чел. (2010). Сто­ли­ца – Улан-Ба­тор. Де­неж­ная еди­ни­ца – туг­рик. Офиц. язык – мон­голь­ский. В адм. от­но­ше­нии тер­ри­то­рия М. со­сто­ит из 21 ай­ма­ка и г. Улан-Ба­тор (вме­сте с ок­ру­жаю­щей тер­ри­то­ри­ей вы­де­лен в са­мо­стоя­тель­ную адм.-терр. еди­ни­цу)', 'mon', undefined);
handleAnnot(true, '14', 'Poland', 'Польша – го­су­дар­ст­во в Центр. Ев­ро­пе. Гра­ни­чит на се­ве­ро-вос­то­ке с Рос­си­ей (Ка­ли­нин­град­ская обл.) и Лит­вой, на вос­то­ке – с Бе­ло­рус­си­ей, на юго-востоке – с Ук­раи­ной, на юге – со Сло­ва­ки­ей и Че­хи­ей, на за­па­де – с Гер­ма­ни­ей. На се­ве­ре омы­ва­ет­ся Бал­тий­ским мо­рем. Пл. 312,7 тыс. км2. Нас. 38,38 млн. чел. (2019). Сто­ли­ца – Вар­ша­ва. Де­неж­ная еди­ни­ца – польск. зло­тый. Офиц. язык – поль­ский. Адм.-терр. де­ле­ние: 16 вое­водств', 'pol', undefined);
handleAnnot(true, '15', 'Spain', 'Испания – го­су­дар­ст­во на юго-за­па­де Ев­ро­пы. За­ни­ма­ет б. ч. Пи­ре­ней­ско­го п-ова, а так­же Ба­ле­ар­ские и Пи­ти­уз­ские о-ва в Сре­ди­зем­ном м. и Ка­нар­ские о-ва в Ат­лан­ти­че­ском ок. На се­ве­ре омы­ва­ет­ся Бис­кай­ским зал., на се­ве­ро-за­па­де и юго-за­па­де – Ат­лан­ти­че­ским ок., на вос­то­ке и юге – Сре­ди­зем­ным м. (дли­на бе­ре­го­вой ли­нии 4964 км). На се­ве­ро-вос­то­ке Пи­ре­ней­ские го­ры об­ра­зу­ют ес­теств. гра­ни­цу И. с Фран­ци­ей и Ан­дор­рой. На за­па­де гра­ни­чит с Пор­ту­га­ли­ей, на юге с Гиб­рал­та­ром. Пл. 505,99 тыс. км2 (вклю­чая Сеу­ту и Ме­ли­лью – 506,03 тыс. км2). Нас. 44,9 млн. чел. (2007). Сто­ли­ца – Мад­рид. Офиц. язык – ис­пан­ский; в ав­то­ном­ных со­об­ще­ст­вах ста­тус офи­ци­аль­ных име­ют так­же ба­ск­ский яз. (Стра­на Бас­ков и На­вар­ра), га­ли­сий­ский яз. (Га­ли­сия), ка­та­лан­ский яз. (Ка­та­ло­ния, Ба­ле­ар­ские о-ва, Ва­лен­сия), ва­лен­сий­ское на­ре­чие (Ва­лен­сия). В адм. от­но­ше­нии стра­на раз­де­ле­на на 17 ав­то­ном­ных со­об­ществ (об­лас­тей), со­стоя­щих из од­ной или не­сколь­ких про­вин­ций (все­го 50) (табл. 1). Под пря­мым управ­ле­ни­ем И. (управ­ля­ют­ся как ав­то­ном­ные со­об­ще­ст­ва) на­хо­дят­ся 2 го­ро­да на сев. по­бе­ре­жье Аф­ри­ки – Се­ута и Ме­ли­лья (вме­сте с при­ле­гаю­щи­ми к ним не­боль­ши­ми ост­ро­ва­ми Алу­се­мас, Ве­лес-де-ла-Го­ме­ра, Ча­фа­ри­нас). Де­неж­ная еди­ни­ца – ев­ро.', 'spa', undefined);
handleAnnot(true, '16', 'UA', 'Украина – го­су­дар­ст­во в Вост. Ев­ро­пе. Гра­ни­чит на се­ве­ре с Бе­ло­рус­си­ей и Рос­сией, на се­ве­ро-вос­то­ке, вос­то­ке и юге с Рос­си­ей, на юго-за­па­де с Ру­мы­ни­ей и Мол­да­ви­ей, на за­па­де с Венг­ри­ей, Сло­ва­ки­ей и Поль­шей; на юге омы­ва­ет­ся Чёр­ным и Азов­ским мо­ря­ми (про­тя­жён­ность бе­ре­го­вой ли­нии 1662 км). Пл. 576,6 тыс. км2 (2015, оцен­ка; 1-е ме­сто в за­ру­беж­ной Ев­ро­пе). Нас. 42,8 млн. чел. (2016; 6-е ме­сто в за­ру­беж­ной Ев­ро­пе). Сто­ли­ца – Ки­ев. Офиц. язык – ук­ра­ин­ский, на вос­то­ке и юге ши­ро­ко рас­про­стра­нён рус­ский, ло­каль­ное рас­про­стра­не­ние в рай­онах про­жи­ва­ния со­от­вет­ст­вую­щих на­ро­дов име­ют так­же молд. и венг. язы­ки. Де­неж­ная еди­ни­ца – грив­на. Адм.-терр. де­ле­ние: 24 об­лас­ти и го­род со спец. ста­ту­сом Ки­ев ', 'ua', undefined);
handleAnnot(true, '17', 'USA', 'США – го­су­дар­ст­во в Сев. Аме­ри­ке. Тер­ри­то­рия со­сто­ит из трёх час­тей: ос­нов­ной [еди­ный мас­сив из 48 шта­тов (смеж­ные шта­ты) и Фе­де­раль­но­го ок­ру­га Ко­лум­бия; 83,5% тер­ри­то­рии и 99,4% нас. стра­ны; в ср. час­ти ма­те­ри­ка Сев. Аме­ри­ка] и 2 экс­кла­вов: шта­та Аля­ска (16,3% и 0,2%; на край­нем се­ве­ро-за­паде ма­те­ри­ка Сев. Аме­ри­ка) и шта­та Га­вайи (0,2% и 0,4%; в центр. час­ти Ти­хо­го ок.). Смеж­ные шта­ты США на вос­то­ке, юго-вос­то­ке и юге омы­ва­ют­ся Ат­лан­ти­че­ским ок. (в т. ч. на юге – Мек­си­кан­ским зал.; от­де­ле­ны Фло­рид­ским прол. от Ку­бы и Ба­гам­ских о-вов), на за­па­де – Ти­хим ок. Штат Аля­ска на се­ве­ре омы­ва­ет­ся Сев. Ле­до­ви­тым ок. (мо­ря Бо­фор­та и Чу­кот­ское), на за­па­де – Бе­рин­го­вым м., на юге – зал. Аля­ска Ти­хо­го ок.; штат Га­вайи – Ти­хим ок. (об­щая дли­на бе­ре­го­вой ли­нии 19924 км). Смеж­ные шта­ты США на се­ве­ре и штат Аля­ска на вос­то­ке гра­ни­чат по су­ше с Ка­на­дой, смеж­ные шта­ты на юге – с Мек­си­кой. Пл. 9372,6 тыс. км2 (4-е ме­сто в ми­ре). Нас. 318,9 млн. чел. (2014; 3-е ме­сто в ми­ре). Сто­ли­ца – Ва­шинг­тон (об­ра­зу­ет Фе­де­раль­ный ок­руг Ко­лум­бия). Офиц. язык – анг­лий­ский. Де­неж­ная еди­ни­ца – дол­лар США. Адм.-терр. де­ле­ние: 50 шта­тов и Фе­де­раль­ный ок­руг Ко­лум­бия (табл.). Ка­ж­дый штат делит­ся на ок­ру­га (граф­ст­ва), кро­ме шта­тов Луи­зиа­на (де­лит­ся на пе­ри­ши – при­хо­ды) и Аля­ска (де­лит­ся на бо­ро – рай­оны); все­го на­счи­ты­ва­ет­ся (2013) 3007 соб­ст­вен­но ок­ру­гов и 137 эк­ви­ва­лент­ных им еди­ниц.', 'usa', undefined);



} // end of PL.init function

})(); // end of closure

/* ================================ end of code ============================= */
