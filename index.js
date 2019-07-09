window.onload = function(){
    if(localStorage.getItem('username')){
        $('.box').style.display = 'none';
    }else{
      $('.box').style.display = 'block';  
    }
}
var ipt = document.querySelector('.ipt'),
    warrper = document.querySelector('.warrper');
var width = window.innerWidth;
var height = window.innerHeight;
var maxX = width - 170;
var maxY = height - 270;
ipt.onkeydown = function (e) {
    if (e.keyCode !== 13) {
        return;
    }
    if (ipt.value) {
        postitem(ipt.value);
        ipt.value = "";
    }
}
var postitem = (data) => {
    var form = {
        value: data,
        date: '',
        positionX: '',
        positionY: '',
        color: '',
        Ncikname: localStorage.getItem('Ncikname')
        }
    form.date = getdate();
    form.color = `rgb(${getRandom(150, 256)},${getRandom(150, 256)},${getRandom(150, 256)})`
    form.positionX = getRandom(0, maxX);
    form.positionY = getRandom(0, maxY);
    postData(form);
}
var getdate = () => {
    var date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        day = date.getDate();
    return year + '年' + (month + 1) + '月' + day + '日'
}
var getRandom = (min, max) => {
    var dec = max - min;
    return Math.floor(Math.random() * dec + min)
}
var postData = (data) => {
    let myajax = new XMLHttpRequest();
    let Adate = JSON.stringify(data)
    myajax.open('POST', 'https://wall-8acb6.firebaseio.com/item.json');
    myajax.onload = function () {
        if (this.status === 200) {
            getdata();
        }
    }
    myajax.send(Adate)
}
var getdata = () => {
    warrper.innerHTML = '';
    let myajax = new XMLHttpRequest();
    myajax.open('get', 'https://wall-8acb6.firebaseio.com/item.json', true);
    myajax.onload = function () {
        if (this.status === 200) {
            var data = JSON.parse(this.responseText);
            for (let key in data) {
                data[key].id = key;
                creaitem(data[key]);
            }
        }
    }
    myajax.send();

}
getdata();
var zIndex = 1;
var creaitem = (data) => {
    var item = document.createElement('div'),
        DaTe = document.createElement('div'),
        close = document.createElement('span'),
        Ncikname = document.createElement('div');
    item.className = 'item';
    item.style.background = data.color;
    item.style.left = data.positionX + 'px';
    item.style.top = data.positionY + 'px';
    item.innerHTML = data.value;
    DaTe.className = 'date';
    DaTe.innerHTML = data.date;
    Ncikname.className = 'Ncikname';
    Ncikname.innerHTML = data.Ncikname;
    item.appendChild(DaTe);
    close.onclick = function () {
        deletedata(data.id);
    }
    close.className = 'close';
    item.onclick = function () {
        this.style.zIndex = zIndex++;
    }
    item.appendChild(close);
    item.appendChild(Ncikname);
    warrper.appendChild(item);
}
var deletedata = (data) => {
    let myajax = new XMLHttpRequest();
    myajax.open('delete', `https://wall-8acb6.firebaseio.com/item/${data}.json`, true)
    myajax.onload = function () {
        getdata();
    }
    myajax.send();
}
function $(event) {
    return document.querySelector(event);
}
$('.loginPage').onclick = function () {
    $('.list').style.left = '0';
    $('.loginPage').classList.add('active');
    $('.registerPage').classList.remove('active');   
}
$('.login').onclick = function () {
    var loginp = {
        'username': $('.loginUsername').value,
        'password': $('.loginPass').value
    }
    console.log(loginp)
    let myajax = new XMLHttpRequest();
    myajax.open('get', 'https://wall-8acb6.firebaseio.com/registry.json', true);
    myajax.onload = function () {
        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            for (let i in data) {
                if (loginp.username == data[i].username) {
                    if (loginp.password == data[i].registerPass) {
                        localStorage.setItem('username', loginp.username);
                        localStorage.setItem('Ncikname', data[i].Ncikname);
                        alert('登陆成功');
                        $('.box').style.display = 'none';
                    }
                    $('.loginPass-msg').style.display = 'block';
                    $('.loginPass').onfocus = function () {
                        $('.loginPass-msg').style.display = 'none';
                    }
                    break;
                }                     
                $('.loginUsaer-msg').style.display = 'block';
                $('.loginUsername').onfocus = function () {
                    $('.loginUsaer-msg').style.display = 'none';
                }
            }
        } else {
            alert(this.status + this.statusText);
        }
    }
    myajax.send();
}
$('.registerPage').onclick = function () {
    $('.list').style.left = '-360px';
    $('.registerPage').classList.add('active');
    $('.loginPage').classList.remove('active');
    let key = true;
    let passkey = true,
        registerUserkey = true,
        Nciknamekey = true;
    $('.registerUser').onblur = function () {
        let myajax = new XMLHttpRequest();
        myajax.open('get', 'https://wall-8acb6.firebaseio.com/registry.json', true);
        myajax.onload = function () {
            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                for (let i in data) {
                    if ($('.registerUser').value == data[i].username) {
                        $('.registerUser-msg').style.display = 'block';
                        registerUserkey = false;
                        $('.registerUser').onfocus = function () {
                            $('.registerUser-msg').style.display = 'none';
                            registerUserkey = true;
                        }
                    }
                }
            } else {
                alert(this.status + this.statusText);
            }
        }
        myajax.send();
    }
    $('.Ncikname').onblur = function () {
        let myajax = new XMLHttpRequest();
        myajax.open('get', 'https://wall-8acb6.firebaseio.com/registry.json', true);
        myajax.onload = function () {
            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                for (let i in data) {
                    if ($('.Ncikname').value == data[i].Ncikname) {
                        $('.Ncikname-msg').style.display = 'block';
                        Nciknamekey = false;
                        $('.Ncikname').onfocus = function () {
                            $('.Ncikname-msg').style.display = 'none';
                            Nciknamekey = true;
                        }
                    }
                }
            } else {
                alert(this.status + this.statusText);
            }
        }
        myajax.send();
    }
    $('.repeatPass').onblur = function () {
        if ($('.repeatPass').value != $('.registerPass').value) {
            $('.registerPass-msg').style.display = 'block';
            passkey = false;
            $('.repeatPass').onfocus = function () {
                $('.registerPass-msg').style.display = 'none';
                passkey = true;
            }
        }
    }
    $('.register').onclick = function () {
        var registry = {
            'username': $('.registerUser').value,
            'Ncikname': $('.Ncikname').value,
            'registerPass': $('.registerPass').value,
            'mail': $('.mail').value
        }
        registrys = JSON.stringify(registry)

        if (registerUserkey) {
            if (Nciknamekey) {
                if (passkey) {
                    for (let i in registry) {
                        if (registry[i] == '') {
                            key = false;
                            break;
                        }
                        key = true;
                    }
                    if (key) {
                        let myajax = new XMLHttpRequest();
                        myajax.open('post', 'https://wall-8acb6.firebaseio.com/registry.json', true);
                        myajax.onload = function () {
                            if (this.status == 200) {
                                alert('注册成功');
                            } else {
                                alert(this.status + this.statusText);
                            }
                        }
                        myajax.send(registrys);
                    } else {
                        console.log('以上信息全部不能为空！');
                    }
                } else {
                    alert('请认真核对密码！')
                }
            } else {
                alert('昵称已存在！')
            }
        } else {
            alert('用户名已存在！')
        }
    }
}




