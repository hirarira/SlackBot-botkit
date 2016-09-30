/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*
 * テムたんbot  v1.1.2.1
 * 更新履歴は以下URLを参照のこと
 * https://github.com/hirarira/SlackTemtanBot/commits/
 */
"use strict";
// アニメデータを蓄積するためのclass
class AnimeData{
	constructor(in_set){
		this.startTime = new Date(in_set.StTime*1000);
		this.endTime = new Date(in_set.EdTime*1000);
		this.title = in_set.Title;
		this.count = in_set.Count;
		this.channel = in_set.ChName;
		this.subTitle = in_set.SubTitle;
		this.url = in_set.Urls;
	}
	showInfo(){
		let outstr = "タイトル："+this.title+"\n";
    if(this.count!=null){
		  outstr += "#"+this.count+"：";
    }
    if(this.subTitle!=null){
      outstr += this.subTitle+"\n";
    }
		outstr += "開始時刻："+this.startTime.getHours()+":"+this.startTime.getMinutes()+"\n";
    if(this.channel!=null){
		  outstr += "放送局:"+this.channel+"\n";
    }
		outstr += "公式サイト："+this.url+"\n";
    console.log(outstr);
		return outstr;
	}
}
// ここからbotkitデフォルトコード
if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

let Botkit = require('./lib/Botkit.js');
let os = require('os');

let controller = Botkit.slackbot({
    debug: true,
});

let bot = controller.spawn({
    token: process.env.token
}).startRTM();
// botkitデフォルトコードここまで
// 以下、各種発言に反応
controller.hears(['(^おはなし$)'],'ambient',function(bot, message) {
	let WordList = [
		'ねえねえ、好きな食べ物って何？',
		'どこか外国行ったことある？',
		'尊敬する人って・・・誰かな～？',
		'どんなことが趣味なのかなあ？',
		'どんなことが好きなの？',
		'す、好きな人って誰かな///',
		'いつもどれくらい寝てる？',
		'いちばん大切にしてるものってな～に？',
		'犬派かな？猫派かな？',
		'好きなゲームってな～に？',
		'夢ってなにかな～？',
		'1番ほしいものってな～に？',
		'お前も消してやろうか？',
		'まだ起きてて大丈夫なの？'
	];
	let rnd = Math.floor( Math.random() * 14 );
	let SayString = WordList[rnd];
  bot.startConversation(message,function(err, convo) {
  	convo.ask(SayString,[{
			default: true,
      callback: function(response, convo) {
    		convo.say('へぇ〜そうなんだ！');
        convo.next();
      }
    }]);
  });
});
controller.hears(['((おぼ|覚)えて)'],'direct_message,direct_mention,mention',function(bot, message) {
	bot.startConversation(message,function(err, convo) {
        convo.ask("わかった！何を覚えればいいの？",[
            {
                default: true,
                callback: function(response, convo) {
					remember_word(response.text,message,0);
                    convo.next();
                }
            }
        ]);
    });
});

controller.hears(['(^話して$)','(^はなして$)'], ['ambient'], function(bot, message) {
    controller.storage.users.get(message.user,function(err, temtan_word) {
		    get_word(message,0);
    });
});
controller.hears(['動画追加','動画ついか'],'direct_message,direct_mention,mention',function(bot, message) {
	bot.startConversation(message,function(err, convo) {
        convo.ask("わかった！何を覚えればいいの？",[
            {
                default: true,
                callback: function(response, convo) {
					remember_word(response.text,message,1);
                    convo.next();
                }
            }
        ]);
    });
});
controller.hears(['(^動画表示$)'], ['ambient'], function(bot, message) {
    controller.storage.users.get(message.user,function(err, temtan_word) {
		    get_word(message,1);
    });
});
controller.hears('(^UNDO$)', ['ambient'], function(bot, message) {
	bot.reply(message, 'キエリンキエリン～・・・えいっ！\n…ってあれ！効果がないよぉ…');
});
controller.hears('(^clear$)', ['ambient'], function(bot, message) {
	bot.reply(message, '全部消えちゃえ～っ！キエキエキエリン！・・・えいっ！\n…ってあれ！効果がないよぉ…');
});
controller.hears('テムたん', ['ambient'], function(bot, message) {
	bot.reply(message, 'なーに？わたしのこと呼んだー？');
});
controller.hears(['(^天気(教|おし)えて$)'], ['ambient'], function(bot, message) {
	bot.startConversation(message,function(err, convo) {
  	convo.ask('どこの天気が知りたいの？',[
		{
    	pattern: "東京",
      callback: function(response, convo) {
      	get_tenki(message,0);
        convo.next();
      }
    },{
      pattern: "大阪",
      callback: function(response, convo) {
        get_tenki(message,1);
        convo.next();
			}
    },{
      pattern: "札幌",
      callback: function(response, convo) {
        get_tenki(message,2);
        convo.next();
			}
    },{
      pattern: "網走",
      callback: function(response, convo) {
        get_tenki(message,3);
        convo.next();
			}
    },{
      pattern: "仙台",
      callback: function(response, convo) {
        get_tenki(message,4);
        convo.next();
			}
    },{
      pattern: "名古屋",
      callback: function(response, convo) {
        get_tenki(message,5);
        convo.next();
			}
    },{
      pattern: "岡山",
      callback: function(response, convo) {
        get_tenki(message,6);
        convo.next();
			}
    },{
      pattern: "那覇",
      callback: function(response, convo) {
        get_tenki(message,7);
        convo.next();
			}
    },{
      default: true,
      callback: function(response, convo) {
        convo.say('うーん…どこだかわからないよぉ…');
        convo.next();
			}
    }]);
	});
});
controller.hears(['ていちゃ'], ['ambient'], function(bot, message) {
	get_teicha(message);
});
controller.hears(['(^(おし|教)えて$)'], ['ambient'], function(bot, message) {
	let out_str = get_wiki_rand(message);
	bot.startConversation(message,function(err, convo) {
        convo.ask(out_str,[{
            default: true,
            callback: function(response, convo) {
							let res = response.text;
							if(res.match(/[知し]って(る|いる)|把握|存知|存じて|はい/)){
								convo.say("へぇ〜お兄ちゃんは博識だねー！");
								convo.next();
							}
							else{
								convo.say("えーお兄ちゃん知らないんだー…");
								convo.next();
							}
            }
        }]);
    });
});
controller.hears(['echo'], ['ambient'], function(bot, message) {
  bot.reply(message,message.text);
});
controller.hears(['(^乱数$)','(^rand$)'], ['ambient'], function(bot, message) {
	bot.startConversation(message,function(err, convo) {
        convo.ask("わかった！最大数はいくつにする？",[
            {
                default: true,
                callback: function(response, convo) {
					let max_num = Number( response.text );
					if(max_num <= 0){
						convo.say("お兄ちゃん！1以上の数字じゃないとダメだよ！");
		                convo.next();
					}
					else if( isNaN(max_num) ){
						convo.say("お兄ちゃん！ちゃんと数字を入れて！");
		                convo.next();
					}
					else if( !isFinite(max_num) ){
						convo.say("お兄ちゃん！無限大なんて入れないで！");
		                convo.next();
					}
					else{
						let get_rand = Math.floor( Math.random() * max_num ) + 1;
						let out_str = "ころころころ〜！「" + get_rand + "」が出たよ！\n";
						convo.say(out_str);
		                convo.next();
					}
                }
            }
        ]);
    });
});
controller.hears('(^サイコロの旅$)', ['ambient'], function(bot, message) {
	let latitude = (Math.random() * 180 ) - 90;
	let longitude = (Math.random() * 360 )- 180;
	let out_str = 'ころころころ〜！次の目的地はここだよ！頑張ってね！\n';
	out_str += "http://www.geocoding.jp/?q=" + latitude + "+" + longitude;
	bot.reply(message,out_str);
});
controller.hears(['こんちは','こんにちは'],'direct_message,direct_mention,mention',function(bot, message) {
	getSlackUser(bot,message,function(UserProf){
		console.log("AAA:"+UserProf.name);
		let out_str = "こんにちは！";
		if(UserProf.real_name != undefined){
			out_str += UserProf.real_name;
		}
		else if(UserProf.name != undefined){
			out_str += UserProf.name;
		}
		out_str += "お兄ちゃん！";
		bot.reply(message,out_str);
	});
});
// fushianasan
controller.hears(['(^fus(h?)ianasan$)'], ['ambient'], function(bot, message) {
	getSlackUser(bot,message,function(UserProf){
		let out_str = "お兄ちゃんの情報を開示するよ！\n";
		out_str += ("ID:"+UserProf.id+"\n");
		out_str += ("Name:"+UserProf.name+"\n");
		out_str += ("RealName:"+UserProf.real_name+"\n");
		out_str += ("Time Zone:"+UserProf.tz+"\n");
		out_str += ("FULL NAME:"+UserProf.profile.first_name+" "+UserProf.profile.last_name+"\n");
		out_str += ("Skype:"+UserProf.profile.skype+"\n");
		out_str += ("Image:"+UserProf.profile.image_48+"\n");
		out_str += ("Email:"+UserProf.profile.email+"\n");
		bot.reply(message,out_str);
	});
});
// マインスイーパ
controller.hears(['(^マインスイーパ)','(^mine)'], ['ambient'], function(bot, message) {
	play_mine(controller,bot,message);
});
// 乗換検索
controller.hears(['(^乗(り?)換)'], ['ambient'], function(bot, message) {
	Norikae(bot,message);
});
controller.hears(['じゃんけん','ジャンケン'], ['ambient'], function(bot, message) {
		console.log("USER:"+message.user);
	    bot.startConversation(message,function(err, convo) {
        convo.ask('じゃんけんしよう！じゃじゃじゃじゃーんけーん',[
        {
            default: true,
            callback: function(response, convo) {
				console.log("USER:"+response.user);
				let janken_res = response.text;
				let tem_janken,your_janken;
				let out_str = "";
				//　グー判定:0
				if( janken_res.match(/ぐー|グー|fist|punch/)){
					your_janken = 0;
				}
				else if(janken_res.match(/ちょき|チョキ|v/)){
					your_janken = 1;
				}
				else if(janken_res.match(/ぱー|パー|hand/)){
					your_janken = 2;
				}
				else{
					your_janken = 3;
				}
				tem_janken = Math.floor( Math.random() * 3);
				switch(tem_janken){
					case 0:out_str = "グー！\n";break;
					case 1:out_str = "チョキ！\n";break;
					case 2:out_str = "パー！\n";break;
				}
				// あいこ
				if(Number(your_janken) == tem_janken){
					out_str += "ってあいこだね！もう一度やろうお兄ちゃん！\n";
				}
				// 勝利
				else if((tem_janken == 0 && your_janken == 2)||
					(tem_janken == 1 && your_janken == 0)||
					(tem_janken == 2 && your_janken == 1)){
					out_str += "あー負けちゃった…！またやろうねお兄ちゃん！\n";
				}
				// 敗北
				else if((tem_janken == 0 && your_janken == 1)||
					(tem_janken == 1 && your_janken == 2)||
					(tem_janken == 2 && your_janken == 0)){
					out_str += "わーい勝った勝った〜！またやろうねお兄ちゃん！\n";
				}
				else{
					out_str += "…ってお兄ちゃん！真面目にやってよ！もー！！\n";
				}
				// out_str += "Y:" + your_janken + " T:" + tem_janken;
                convo.say(out_str);
                convo.next();
            }
        }
        ]);
    });
});
controller.hears(['さよなら'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.startConversation(message,function(err, convo) {

        convo.ask('「えっ…帰っちゃうけど…本当にいいの？」',[
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('うん…わかった。さよならお兄ちゃん！');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    },3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('なーんだ！びっくりさせないでよぉ…');
                convo.next();
            }
        }
        ]);
    });
});
// help
// helpに表示されない隠しコマンド
// (さよなら,fusianasan,@tem_tan こんにちは,サイコロの旅,echo)
controller.hears(['(^help$)','^ヘルプ$','^説明$'], ['ambient'], function(bot, message) {
	let out_str = "わたしが反応する言葉を紹介するね！\n"
	+"・おはなし\n"
	+"お兄ちゃんたちにわたしが色々質問するよ！\n\n"
	+"・@temtan おぼえて\n"
	+"お兄ちゃんたちの教えてくれた単語を覚えるよ！\nあまり変なことは覚えさせないでね…^^;\n\n"
	+"・はなして\n"
	+"お兄ちゃんたちが教えてくれた言葉を話すよ\nちょっと恥ずかしいけどね…	///\n\n"
	+"・@temtan 動画追加\n"
	+"Youtubeやニコニコとかの動画を覚えるよ！\n覚えたい動画のアドレスを教えてね！\n\n"
	+"・動画表示\n"
	+"わたしが覚えてる動画を表示するよ！\n\n"
	+"・天気教えて\n"
	+"明日と明後日の天気と気温を教えるよ！\n"
	+"今答えられる所は「東京,大阪,仙台,札幌,網走,名古屋,那覇」だけだから気をつけてね！\n"
	+"追加したい場所があったらパパに言ってね！\n\n"
	+"・ていちゃ\n"
	+"今のていちゃにいる人たちの数と、どんな人がいるのかを教えるよ！\n\n"
	+"・おしえて\n"
	+"わたしが魔法で持ってきたランダムな単語をお兄ちゃんに教えてあげるよ!\n"
	+"どんな言葉が飛び出すかは使ってみてのお楽しみだよー！\n"
	+"・mine\n"
	+"マインスイーパを遊ぶことができるよ！\n\"mine,X座標,Y座標\"でも開くことができるよ！\n\n"
	+"・じゃんけん\n"
	+"そのまんんまだけど、私とじゃんけんをして遊べるよ！\n\n"
	+"・乱数|rand"
	+"0からお兄ちゃんたちが入力した値までの間の値をランダムで出すよー！\n"
	+"1以上の値を入力してね！"
	+"・乗換\n"
	+"(乗換 {出発駅} {到着駅} {出発日} {出発時刻})の形で乗換検索ができるよ！\n"
	+"出発日と出発時刻を省略すると、今の日時が入るよ！\n\n"
	+"・@temtan 今日のアニメは？\n"
	+"今日お兄ちゃんが見るアニメを教えるよ！\n";
	bot.reply(message,out_str);
});
// 今日のアニメを教えてくれる
controller.hears(['(今日(.*)アニメ)'], ['direct_mention,mention'], function(bot, message) {
  let in_user = "hirarira617";
  let in_url = "http://cal.syoboi.jp/rss2.php?filter=1&alt=json&usr=" + in_user;
  console.log("test");
  getRequest(in_url).then( (result) => {
  	let AnimeDataSet = [];
  	let importAnimeSet = JSON.parse(result);
    let outstr = "今日のアニメは...\n";
  	for(let i=0;i<importAnimeSet.items.length;i++){
  		AnimeDataSet[i] = new AnimeData(importAnimeSet.items[i]);
  		outstr += AnimeDataSet[i].showInfo() + "\n----\n";
  	}
    outstr += "みたいだよ！お兄ちゃん！\n";
    bot.reply(message,outstr);
  });
});
// 関数郡
// PromiseでHTTPリクエストを実施する。
function getRequest(getURL){
	let request = require('request');
  return new Promise((resolve,reject) => {
  	request(getURL, function (error, response, body) {
  	  if(!error && response.statusCode == 200){
        resolve(body);
  		}
  		else{
        reject(null);
  		}
  	});
  });
}
// 指定したIDのユーザ情報を取得できる。コールバック関数なので注意！
// 引数は(bot,message,callback)の形
function getSlackUser(bot,message,callback){
	// Botのアクセストークン取得
	let token = bot.config.token;
	let user_id = message.user;
	// HTTPリクエスト
	let request = require('request');
	let in_url = "https://slack.com/api/users.list?token=" + token;
	let send_option = {
		url: in_url,
		json: true
	};
	request.get(send_option, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('OK: '+ response.statusCode);
			if(body.ok){
				let members = body.members;
				for(let i=0;i<members.length;i++){
					console.log("ID:"+members[i].id);
					if(members[i].id == user_id){
						callback(members[i]);
					}
				}
			}
			else{
				console.log('error:'+body.error);
			}
		}
		else{
			console.log('error: '+ response.statusCode);
		}
	});
}
// 短縮URL化に必要なトークンを取ってくるだけ
function GetShortURLToken(){
	let fs = require('fs');
	let buf = fs.readFileSync("./var/token.txt");
	let token = buf.toString();
	return token;
}
// 短縮URLを作成する関数
function ShortURL(in_url,callback){
	let token = GetShortURLToken();
	let request = require('request');
	let set_url = "https://www.googleapis.com/urlshortener/v1/url?key=" + token;
	let send_option = {
		url : set_url,
		headers:{
			'Content-Type': 'application/json'
		},
		json : true,
		body :{
            longUrl: in_url
        }
	};
	request.post(send_option,function(error, response, body){
		if (!error && response.statusCode == 200) {
			console.log('OK: '+ response.statusCode);
			callback(body);
		}
		else{
			console.log('error: '+ response.statusCode);
		}
	});
}
// 自然数かつ10000未満の値か判定
function isInteger(x){
	if(isNaN(x))return false;
	if(isFinite(x))return false;
	if(x <= 0 || x >= 10000)return false;
	return Math.floor(x) === x;
}
// 乗り換え案内
function Norikae(bot,message){
	let in_str = message.text;
	let out_str = "";
	let in_url = "http://www.navitime.co.jp/transfer/searchlist?&basis=1&orvStationName=";
	let NorikaeST = in_str.split(/ |　/);
	if(NorikaeST.length >= 3){
		let StartST = NorikaeST[1];
		let EndST = NorikaeST[2];
		out_str = StartST + "駅 から" + EndST + "駅 までの乗換経路はこんな感じだよ！\n";
		in_url += StartST + "&dnvStationName=" + EndST;
		if(NorikaeST.length >= 4){
			let NowDate = new Date();
			// N分前にマッチ
			if(in_str.match(/前|(B|b)efore/)){

			}
			else if(in_str.match(/後|(A|a)fter/)){

			}
			else{
				let settimeOK = true;
				// 10:00 時刻のみ
				if(NorikaeST.length == 4){
					let inHM = NorikaeST[3].split(":");
				}
				else{
					// 2010/01/01 10:20 フル形式
					let inYMD = NorikaeST[3].split("/");
					let inHM = NorikaeST[4].split(":");
					// 2要素以上あるかチェック
					settimeOK = (inYMD.length >= 2)?true:false;
					for(let i=0;i<inYMD.length;i++){
						inYMD[i] = Number(inYMD[i]);
						// 自然数判定
						if(!isInteger(inYMD[i])){
							settimeOK = false;
						}
						console.log(inYMD[i]);
					}
					if(settimeOK){
						// 04/06 などの月日のみパターン
						if(inYMD.length == 2){
							in_url += "&month="+ inYMD[0];
							in_url += "&day=" + inYMD[1];
						}
						else{
							in_url += "&month="+ inYMD[0] +"%2F" + inYMD[1];
							in_url += "&day=" + inYMD[2];
						}
					}
				}
				settimeOK = true;
				// 時、分が揃っているかチェック
				settimeOK = (inHM.length >= 2)?true:false;
				for(let i=0;i<inHM.length;i++){
					inHM[i] = Number(inHM[i]);
					if(!isInteger(inHM[i])){
						settimeOK = false;
					}
					console.log(inHM[i]);
				}
				if(settimeOK){
					in_url += "&hour=" + inHM[0] + "&minute=" + inHM[1];
					console.log("OK!");
				}
			}
		}
		console.log(in_url);
		// 出来たURLを短縮化
		ShortURL(in_url,function(body){
			console.log("ShortURL:"+body.id);
			out_str += body.id;
			bot.reply(message,out_str);
		});
	}
	else{
		console.log("入力エラー");
		bot.reply(message,"お兄ちゃん！\n乗換 {出発駅} {目的駅} 年/月/日 時間:分\nの形式で入力してね！");
	}
}
// Wikipediaランダム
function get_wiki_rand(message){
	let get_url = "https://ja.wikipedia.org/wiki/%E7%89%B9%E5%88%A5:%E3%81%8A%E3%81%BE%E3%81%8B%E3%81%9B%E8%A1%A8%E7%A4%BA"
	let out_str = "お兄ちゃん！「"
	let get_title = "";
	// スクレイピング
	// http://qiita.com/ktty1220/items/64168e8d416d6d8ffb45 参照
	// https://www.npmjs.com/package/cheerio-httpcli
	console.log("test");
	let client = require('cheerio-httpcli');
	let wiki_about = client.fetchSync(get_url);
	console.log(wiki_about.$('title').text());
	get_title = wiki_about.$('title').text();
	get_title = get_title.substr(0,get_title.length - 12);
	out_str += get_title;
	out_str += "」って知ってる？";
	return out_str;
}
// ていちゃ情報取得
function get_teicha(message){
	let request = require('request');
	let url = 'http://localhost/hirarira/teacha/get_teicha.php';
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('OK: '+ response.statusCode);
			let res_teicha = createArray(body,1);
			let out_str = "今てい☆ちゃには"+res_teicha[0]+"人いて、"+res_teicha[1]+"人が見てる見たいだよ！\n";
			out_str += "今はこんな人たちがいるみたいだよー！\n";
			console.log(res_teicha);
			console.log("入室数："+res_teicha[0]+"\nROM数："+res_teicha[1]);
			for(let i=0;i<res_teicha[0];i++){
				console.log((i+1)+"人目：名前："+res_teicha[ (2+(i*2)) ]+"：コメント："+res_teicha[ (3+(i*2)) ]);
				out_str += (i+1)+"人目：名前："+res_teicha[ (2+(i*2)) ]+"：コメント："+res_teicha[ (3+(i*2)) ] + "\n";
			}
			bot.reply(message,out_str);
	  	}
		else{
			console.log('error: '+ response.statusCode);
	  	}
	})
}
//	天気情報取得
function get_tenki(message,pl_num){
	// 天気の場所
	// http://weather.livedoor.com/weather_hacks/rss_feed_list
	let PlaceNumberList = ["130010","270000","016010","013010","040010",
		"230010","330010","471010"];
	let PlaceNameList = ["東京","大阪","札幌","網走","仙台","名古屋","岡山","那覇"];
	let add_pl_num = PlaceNumberList[pl_num];
	let add_word = PlaceNameList[pl_num];
	let request = require('request');
	let url = 'http://weather.livedoor.com/forecast/webservice/json/v1?city=';
	url += add_pl_num;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('OK: '+ response.statusCode);
			let tenki_obj = eval("(" + body + ")");
			let out_str = "";
			for(let i=0;i<3;i++){
				if(tenki_obj.forecasts[i] == null){
					break;
				}
				console.log("天気："+tenki_obj.forecasts[i].telop);
				console.log("日付："+tenki_obj.forecasts[i].date);
				switch(i){
					case 0:
						out_str += "今日";
					break;
					case 1:
						out_str += "明日";
					break;
					case 2:
						out_str += "明後日";
					break;
				}
				out_str += "("+tenki_obj.forecasts[i].date+")の"+add_word+"のお天気は"+tenki_obj.forecasts[i].telop;
				if(tenki_obj.forecasts[i].temperature.max!=null){
					console.log("最高気温："+tenki_obj.forecasts[i].temperature.max.celsius);
					out_str += "で\n最高気温は"+tenki_obj.forecasts[i].temperature.max.celsius+"度";
				}
				out_str += "\n";
			}
			out_str += "みたいだよ！お兄ちゃん！";
			bot.reply(message,out_str);
		}
		else{
		console.log('error: '+ response.statusCode);
	  	}
	})
}
function get_word(message,get_no){
	// Inputテスト
	let fs = require('fs');
	let buf,read_str,temtan_word;
	switch(get_no){
		case 0:
			buf = fs.readFileSync("./var/rememberWord.txt");
			read_str = buf.toString();
			temtan_word = read_str.split("\n");
		break;
		default:
			buf = fs.readFileSync("./var/movie.txt");
			read_str = buf.toString();
			temtan_word = analyze_csv(read_str);
		break;
	}
	let out_str = '今私が覚えてるのは…\n';
	for(let i = 0;i< temtan_word.length;i++){
		if(get_no == 1){
			if(temtan_word[i][0] != undefined && temtan_word[i][1] != undefined){
				out_str += temtan_word[i][1] + "\n" + temtan_word[i][0] + "\n\n";
			}
		}
		else if(get_no == 0){
			if(temtan_word[i] != undefined){
				out_str += temtan_word[i];
				out_str += "\n";
			}
		}
	}
	out_str += "だよ！お兄ちゃん！";
	bot.reply(message,out_str);
}

function remember_word(add_value,message,add_no){
	let add_url = "";
	switch(add_no){
		case 0:
			add_url = './var/rememberWord.txt'
		break;
		case 1:
			add_url = './var/movie.txt'
			if(add_value.substring(0,5)!="<http"){
				bot.reply(message,'あれぇ〜？動画のURLじゃないみたいだよ〜？');
				return;
			}
			else{
				add_value = add_value.substring(1,add_value.length-1);
				add_value += ",";
				// スクレイピング
				// http://qiita.com/ktty1220/items/64168e8d416d6d8ffb45 参照
				// https://www.npmjs.com/package/cheerio-httpcli
				let client = require('cheerio-httpcli');
				let movie_about = client.fetchSync(add_value);
				console.log(movie_about.$('title').text());
				add_value += movie_about.$('title').text();
			}
		break;
	}
	let fs = require('fs');
	fs.appendFile(add_url,add_value+"\n",'utf8', function (err) {
		console.log(err);
		if(err == null){
			switch(add_no){
				case 0:
					bot.reply(message,'「' +add_value + ' 」を覚えたよ！');
				break;
				case 1:
					bot.reply(message,"次の動画を追加したよ!\n"+movie_about.$('title').text());
				break;
			}
		}
	});
}
function createArray(csvData,num) {
	let tempArray = csvData.split("\n");
	let csletray = new Array();
	for(let i = 0; i<tempArray.length;i++){
		csletray[i] = tempArray[i].split(",");
	}
	console.log(csletray[num]);
	return csletray[num];
}
/*-------------------------------------------------------------------*/
/*-------------------------マインスイーパ系ここから-----------------------*/
/*-------------------------------------------------------------------*/

function play_mine(controller,bot,message){
	let input_mes = message.text.split(",");
	// Inputテスト
	let fs = require('fs');
	let buf = fs.readFileSync("./var/ms.txt");
	// 一つの集合体として読み込み
	let read_str = buf.toString();
	let res_str = analyze_csv(read_str);
	// Mode
	// 0...初期状態
	// 1...ゲーム開始中
	let mode = res_str[0][0];
	let BanSize = 9;
	// Bamen
	// 0...何もなし
	// 1...爆弾
	// Tansa
	// 0...未探査
	// 1...探査済
	let Bamen,Tansa;
	if(mode == 0){
		bot.startConversation(message,function(err, convo) {
			convo.ask("新しいゲームを始めるよ！爆弾の数はいくつにする？\n(10個〜80個)",[
            {
                default: true,
                callback: function(response, convo) {
					let out_str = "";
					let bomb_num = Number(response.text);
					if( bomb_num >= 10 && bomb_num <= 80 ){
						Bamen = set_bomb(bomb_num,BanSize);
						Tansa = new Array();
						for(let i=0;i<BanSize;i++){
							Tansa[i] = new Array();
							for(let j=0;j<BanSize;j++){
								Tansa[i][j] = 0;
							}
						}
						show_ban(Bamen);
						show_ban(Tansa);
						mode = 1;
						out_str = "盤面を作ったよ！";
						output_str(mode,BanSize,Bamen,Tansa);
					}
					else{
						out_str = "数がおかしいよぉ・・・";
					}
					bot.reply(message,out_str);
                    convo.next();
                }
            }
			]);
		});
	}
	else{
		input_mes[1] = Math.floor(Number(input_mes[1]));
		input_mes[2] = Math.floor(Number(input_mes[2]));
		if(input_mes[1] >= 0 && (input_mes[1]< BanSize) &&
				input_mes[2] >= 0 && (input_mes[2] < BanSize) ){
			let out_str = play_mine_2(input_mes[1],input_mes[2]);
			bot.reply(message,out_str);
		}
		else{
			bot.startConversation(message,function(err, convo) {
				convo.ask("どこのマスを踏む？(X,Y)",[
				{
					default: true,
					callback: function(response, convo) {
						let input_xy = response.text.split(",");
						let input_x = Math.floor(Number(input_xy[0]));
						let input_y = Math.floor(Number(input_xy[1]));
						let out_str = play_mine_2(input_x,input_y);
						bot.reply(message,out_str);
						convo.next();
					}
				}
				]);
			});
		}

	}
}
function play_mine_2(input_x,input_y){
	// Inputテスト
	let fs = require('fs');
	let buf = fs.readFileSync("./var/ms.txt");
	// 一つの集合体として読み込み
	let read_str = buf.toString();
	let res_str = analyze_csv(read_str);
	// Mode
	// 0...初期状態
	// 1...ゲーム開始中
	let mode = res_str[0][0];
	let BanSize = 9;
	// Bamen
	// 0...何もなし
	// 1...爆弾
	// Tansa
	// 0...未探査
	// 1...探査済
	let Bamen,Tansa;
	// 爆弾個数
	let BombNum = 0;
	// 盤サイズ読み込み
	BanSize = Number(res_str[1][0]);
	console.log("BanSize:"+BanSize);
	Bamen = new Array();
	for(let i=0;i<BanSize;i++){
		Bamen[i] = new Array();
		for(let j=0;j<BanSize;j++){
			Bamen[i][j] = res_str[i+2][j];
			if(Bamen[i][j] == 1){
				BombNum++;
			}
		}
	}
	show_ban(Bamen);
	// 探査状況読み込み
	Tansa = new Array();
	for(let i=0;i<BanSize;i++){
		Tansa[i] = new Array();
		for(let j=0;j<BanSize;j++){
			let ni = Number(i)+Number(BanSize)+2;
			Tansa[i][j] = res_str[ni][j];
		}
	}
	show_ban(Tansa);
	// 周辺状況作成
	let Round = new Array();
	for(let i=0;i<BanSize;i++){
		Round[i] = new Array();
		for(let j=0;j<BanSize;j++){
			if(Bamen[i][j] == 1){
				Round[i][j] = "*";
			}
			else{
				let NNum = 0;
				for(let lx = -1;lx<=1;lx++){
					for(let ly = -1;ly<=1;ly++){
						let nx = i + lx;
						let ny = j + ly;
						if(nx >= 0 && nx < BanSize &&
							ny >= 0 && ny < BanSize){
							if(Bamen[nx][ny] == 1){
								NNum++;
							}
						}
					}
				}
				Round[i][j] = NNum;
			}
		}
	}
	show_ban(Round);
	let out_str = "";
	if(input_x >= 0 && (input_x < BanSize) &&
			input_y >= 0 && (input_y < BanSize) ){
		out_str = "X:" + input_x + " Y:" + input_y + "\nB";
		// 盤面表示
		Tansa[input_y][input_x] = 1;
		Tansa = rensa_search(Tansa,Round,input_x,input_y);
		// 現在盤面表示
		out_str = "0";
		for(let i = 0;i < BanSize;i++){
			out_str += "|" + i;
		}
		out_str += "|\n";
		for(let i = 0;i < BanSize;i++){
			out_str += i;
			for(let j = 0;j < BanSize;j++){
				if(Tansa[i][j] == 1){
					out_str += "|" + Round[i][j];
				}
				else{
					out_str += "|n";
				}
			}
			out_str += "|\n";
		}
		console.log(out_str);
		// 閉じている個数
		let CloseNum = 0;
		for(let i=0;i<BanSize;i++){
			for(let j=0;j<BanSize;j++){
				if(Tansa[i][j] == 0){
					CloseNum++;
				}
			}
		}
		out_str += "爆弾："+BombNum+"個\n";
		out_str += "残り" + (CloseNum-BombNum) + "個だよ！\n";
		//現在盤面表示ここまで
		// 地雷を踏んでしまう
		if(Bamen[input_y][input_x] == 1){
			console.log("Bomb!");
			out_str += "あ〜あ！爆弾踏んじゃった…";
			mode = 0;
		}
		// 攻略完了！
		if(CloseNum <= BombNum){
			console.log("攻略完了！");
			out_str += "おめでとう！爆弾を全部除去できたよ！";
			mode = 0;
		}
		output_str(mode,BanSize,Bamen,Tansa);
	}
	else{
		out_str = "変な値入れないで！";
	}
	return out_str;
}
// 盤面出力用
function output_str(mode,BanSize,Bamen,Tansa){
	// 出力結果作成
	let out_str = "";
	out_str += mode + "\n";
	out_str += BanSize + "\n";
	for(let i=0;i<BanSize;i++){
		for(let j=0;j<BanSize;j++){
			out_str += Bamen[i][j] + ",";
		}
		out_str += "\n";
	}
	for(let i=0;i<BanSize;i++){
		for(let j=0;j<BanSize;j++){
			out_str += Tansa[i][j] + ",";
		}
		out_str += "\n";
	}
	let fs = require('fs');
	// 盤の出力
	fs.writeFile('./var/ms.txt', out_str , function (err) {
	});
}
function analyze_csv(in_str){
	let line = in_str.split("\n");
	let res_str = new Array();
	for(let i = 0;i < line.length;i++){
		res_str[i] = line[i].split(",");
	}
	return res_str;
}
function set_bomb(num,size){
	// 盤面の数より爆弾が多い時は瞬殺
	if(num >= (size*size) ){
		console.log("盤面の数より爆弾が多い");
		return null;
	}
	let Ban = new Array();
	for(let i=0;i<size;i++){
		Ban[i] = new Array();
		for(let j=0;j<size;j++){
			Ban[i][j] = 0;
		}
	}
	// 爆弾セット
	for(let i=0;i<num;i++){
		let x,y;
		do{
			x = Math.floor( Math.random() * size );
			y = Math.floor( Math.random() * size );
		}while(Ban[x][y] == 1);
		Ban[x][y] = 1;
	}
	return Ban;
}
function show_ban(ban){
	let out_str = "";
	for(let i = 0;i < ban.length;i++){
		for(let j = 0;j < ban[i].length;j++){
			out_str += "|" + ban[i][j];
		}
		out_str += "\n";
	}
	console.log(out_str);
}
function rensa_search(Tansa,Round,x,y){
	x = Number(x);
	y = Number(y);
	if(Round[y][x] == 0){
		Tansa[y][x] = 1;
		// 周囲1マスをオープンさせる。
		if((x-1)>=0 && Tansa[y][x-1]==0){
			Tansa = rensa_search(Tansa,Round,x-1,y);
		}
		if((x+1)<Tansa.length && Tansa[y][x+1]==0){
			Tansa = rensa_search(Tansa,Round,x+1,y);
		}
		if((y-1)>=0 && Tansa[y-1][x]==0){
			Tansa = rensa_search(Tansa,Round,x,y-1);
		}
		if((y+1)<Tansa.length && Tansa[y+1][x]==0){
			Tansa = rensa_search(Tansa,Round,x,y+1);
		}
		for(let lx = -1;lx<=1;lx++){
			for(let ly = -1;ly<=1;ly++){
				let nx = x + lx;
				let ny = y + ly;
				if(nx >= 0 && nx < Tansa.length  &&
						ny >= 0 && ny < Tansa.length ){
					Tansa[ny][nx] = 1;
				}
			}
		}
	}
	return Tansa;
}
//---------------------------マインスイーパ系ここまで---------------------------
