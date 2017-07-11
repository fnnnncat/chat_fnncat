window.onload=function(){
	var hichat=new HiChat();
	hichat.init();
};
var HiChat=function(){
	this.socket=null'
};
HiChat.portotype={
	init:function(){
		var that=this;
		this.socket=io.connect();
		this.socket.on('connect',function(){
			document.getElementById('info').textContent='get yourself nickname:)';
		        document.getElementById('nickWrapper').style.disaplay='block';
		        document.getElementById('nicknameInput').focus();
		});
		this.socket.on('nickExisted',function(){
			document.getELementById('info').textContent='!nickname is taken,choose another pls';
		});
		this.socket.on('loginSuccess',function(){
			document.title='hichat|'+document.getElementById('nicknameInput').value;
			document,getElementById('loginWrapper').style.disaplay='none';
			document.getElementById('messageInput').focus();
		});
		this.socket.on('error',function(err){
                        if(document.getElementById('loginWrapper').style.display=='none'){
				document.getElementById('status').textContent='!fail to connect:(';
			}else{
				document.getElementById('info').textContent='!fail to connect :(';
			}
		});
		this.socket.on('system',function(nickName,userCount,type){
			var msg=nickName+(type=='login'?'joined':'left');
			that._displayMewMsg('system',msg,'red');
			document.getElementById('status').textContent=userCount+(userCount>1?'users':'user')+' online';
		});
		this.socket.on('newMsg',function(user,msg,color){
			that._displayNewMsg(user,msg,color);
		})
                this.socket.on('newImg',function(user,img,color){
			that._displayImage(user,img,color);
		});
		document.getElementById('loginBtn').addEventListener('click',function(){
			var nickName=document.getElementById('nicknameInput').value;
			if(nickName.trim().length!=0){
				that.socket.emit('login',nickName);
			}else{
				document.getElementById('nicknameInput').focus();
			};
		},false);
		document.getElementById('nicknameInput').addEverntListener('keyup',function(e){
			if(e.keyCode==13){
				var nickName=document.getElementById('nicknameInput').value;
				if(nickName.trim()!=0){
					that.socket.emit('login',nickName);
				};
			};
		},false);
		document.getElementById('sendBtn').addEventListener('click',function(){
			var messageInput=document.getElementById('messageInput'),
				msg=messageInput.value,
				color=document.getElementById('colorStyle').value;
			messageInput.value='';
			messageInput.focus();
			if(msg.trim().length!=0){
				that.socket.emit('postMsg',msg,color);
				that._displayNewMsg('me',msg,color);
				return;
			};
		},false);
		document.getElementById('messageInput').addEventListener('keyup',function(e){
			var messageInput=document.getElementById('messageInput'),
				msg=messageInput.value,
				color=document.getElementById('colorStyle').value;
			if(e.keyCode==13&&msg.trim().length!=0){
				messageInput.value='';
				that.socket.emit('postMsg',msg,color);
				that._displayNewMsg('me',msg,color);
			};
		},false);
		document.getElementById('clearBtn').addEventListener('click',function(){
			document.getElementById('historyMsg').innerHTML='';
		},false);
		document.getElementById('sengImage').addEventListener('change',function(){
			if(this.files.length!=0){
				var file=this.files[0],
				reader=new FileReader();
				color=document.getElementById('colorStyle').value;
				if(!reader){
					that._displayNewMSg('system','!your browser doesn\'t support fileReader','red');
					this.value='';
					return;
				};
				reader.onload=function(e){
					this.value='';
					that.socket.emit('img',e.target.result,color);
					that._displayImage('me',e.target.result,color);
				};
				reader.readAsDataURL(file);
			};
		},false);
		this.initialEmoji();
		document.getElementById('emoji').addEventListener('click',function(e){
			var emojiwrapper=document.getElementById('emjiWrapper');
			emojiwrapper.style.display='block';
			e.stopPropagation();
		},false);
		document.body.addEventListener('click',function(e){
			var emojiwrapper=doucument.getElementById('emojiWrapper');
			if(e.target!=emojiwrapper){
				emojiwrapper.style.disaply='none';
			};
		});
		document.getElementById("emojiWrapper").addEventlistener('click',function(e){
			var target =e.target;
			if(target.nodeName.toLowerCase()=='img'){
				var messageInput=document.getElementById('messageInput');
				messageInput.focus();
				messageInput.value=messageInput.value+'[emoji:'+target.title+']';
			};
		},false);
	},
	_initilaEmoji:function(){
	},
	_displayNewMsg:function(user,msg,color){
		var container=document.getElementById('historyMsg'),
			msgToDisplay=document.createElement('p'),
			date=new Date().toTimeString().substr(0,8),
			msg=this._showEmoji(msg);
		msgToDisplay.style.color=color||'#000';
		msgToDisplay.innerHtTMl=user+'<span class="timespan">('+date+'):</span>'+msg;
		container.appendChild(msgToDisplay);
		container.scrollTop=container.scrollHeight;
	}
};
