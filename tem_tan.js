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

# RUN THE BOT:

  Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

  Run your bot from the command line:

    token=<MY TOKEN> node bot.js

# USE THE BOT:

  Find your bot inside Slack to send it a direct message.

  Say: "Hello"

  The bot will reply "Hello!"

  Say: "who are you?"

  The bot will tell you its name, where it running, and for how long.

  Say: "Call me <nickname>"

  Tell the bot your nickname. Now you are friends.

  Say: "who am I?"

  The bot will tell you your nickname, if it knows one for you.

  Say: "shutdown"

  The bot will ask if you are sure, and then shut itself down.

  Make sure to invite your bot into other channels using /invite @<my bot>!

# EXTEND THE BOT:

  Botkit is has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears(['おはなし'],'ambient',function(bot, message) {
	var rnd = Math.floor( Math.random() * 14 );
	var SayString;
	switch(rnd){
		case 0:
			SayString = 'ねえねえ、好きな食べ物って何？';
		break;
		case 1:
			SayString = 'どこか外国行ったことある？';
		break;
		case 2:
			SayString = '尊敬する人って・・・誰かな～？';
		break;
		case 3:
			SayString = 'どんなことが趣味なのかなあ？';
		break;
		case 4:
			SayString = 'どんなことが好きなの？';
		break;
		case 5:
			SayString = 'す、好きな人って誰かな///';
		break;
		case 6:
			SayString = 'いつもどれくらい寝てる？';
		break;
		case 7:
			SayString = 'いちばん大切にしてるものってな～に？';
		break;
		case 8:
			SayString = '犬派かな？猫派かな？';
		break;
		case 9:
			SayString = '好きなゲームってな～に？';
		break;
		case 10:
			SayString = '夢ってなにかな～？';
		break;
		case 11:
			SayString = '1番ほしいものってな～に？';
		break;
		case 12:
			SayString = 'お前も消してやろうか？';
		break;
		case 13:
			SayString = 'まだ起きてて大丈夫なの？';
		break;
	}
    bot.startConversation(message,function(err, convo) {
        convo.ask(SayString,[
            {
                default: true,
                callback: function(response, convo) {
                    convo.say('へぇ〜そうなんだ！');
                    convo.next();
                }
            }
        ]);
    });
});
controller.hears(['おぼえて','覚えて'],'direct_message,direct_mention,mention',function(bot, message) {
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

controller.hears(['話して','はなして'], ['ambient'], function(bot, message) {
    controller.storage.users.get(message.user,function(err, temtan_word) {
		var temtan_word = new Array();
		temtan_word = get_word(message,0);
    });
})
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
controller.hears(['動画表示'], ['ambient'], function(bot, message) {
    controller.storage.users.get(message.user,function(err, temtan_word) {
		var temtan_word = new Array();
		temtan_word = get_word(message,1);
    });
})
controller.hears('UNDO', ['ambient'], function(bot, message) {
	bot.reply(message, 'キエリンキエリン～・・・えいっ！\n…ってあれ！効果がないよぉ…');
})
controller.hears('clear', ['ambient'], function(bot, message) {
	bot.reply(message, '全部消えちゃえ～っ！キエキエキエリン！・・・えいっ！\n…ってあれ！効果がないよぉ…');
})
controller.hears('テムたん', ['ambient'], function(bot, message) {
	bot.reply(message, 'なーに？わたしのこと呼んだー？');
})
controller.hears(['天気おしえて','天気教えて'], ['ambient'], function(bot, message) {
	bot.startConversation(message,function(err, convo) {
        convo.ask('「どこの天気が知りたいの？」',[
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
        },
		{
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
        }
		]);
	});
})
controller.hears(['ていちゃ','てい☆ちゃ'], ['ambient'], function(bot, message) {
	get_teicha(message);
})
controller.hears(['おしえて','教えて'], ['ambient'], function(bot, message) {
	var out_str = get_wiki_rand(message);
	bot.startConversation(message,function(err, convo) {
        convo.ask(out_str,[
            {
                default: true,
                callback: function(response, convo) {
					var res = response.text;
					if(res.match(/[知し]って(る|いる)*|把握*|存知*|存じて*|はい/)){
						convo.say("へぇ〜お兄ちゃんは博識だねー！");
		                convo.next();
					}
					else{
						var request = require('request');
						var url = "http://localhost/ajax_test/get_wiki.php";
						request.post(url, function(error, response, body){
							if (!error && response.statusCode == 200) {
								console.log(body);
								var out_str = "もー仕方ないなーお兄ちゃんは…これのことだよ！\n";
								out_str += "https://ja.wikipedia.org/wiki/";
								out_str += body;
								convo.say(out_str);
								convo.next();
							} else {
								console.log('error: '+ response.statusCode);
								convo.say('error: '+ response.statusCode);
								convo.next();
							}
						});
					}
                }
            }
        ]);
    });
})
controller.hears(['乱数','rand'], ['ambient'], function(bot, message) {
	bot.startConversation(message,function(err, convo) {
        convo.ask("わかった！最大数はいくつにする？",[
            {
                default: true,
                callback: function(response, convo) {
					var max_num = Number( response.text );
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
						var get_rand = Math.floor( Math.random() * max_num ) + 1;
						var out_str = "ころころころ〜！「" + get_rand + "」が出たよ！\n";
						convo.say(out_str);
		                convo.next();
					}
                }
            }
        ]);
    });
})
controller.hears('サイコロの旅', ['ambient'], function(bot, message) {
	var latitude = (Math.random() * 180 ) - 90;
	var longitude = (Math.random() * 360 )- 180;
	var out_str = 'ころころころ〜！次の目的地はここだよ！頑張ってね！\n';
	out_str += "http://www.geocoding.jp/?q=" + latitude + "+" + longitude;
	bot.reply(message,out_str);
})
controller.hears(['こんちは','こんにちは'],'direct_message,direct_mention,mention',function(bot, message) {
	getSlackUser(bot,message,function(UserProf){
		console.log("AAA:"+UserProf.name);
		var out_str = "こんにちは！";
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
controller.hears(['fushianasan','fusianasan'], ['ambient'], function(bot, message) {
	getSlackUser(bot,message,function(UserProf){
		var out_str = "お兄ちゃんの情報を開示するよ！\n";
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
})
// マインスイーパ
controller.hears(['マインスイーパ','mine'], ['ambient'], function(bot, message) {
	play_mine(controller,bot,message);
})
// 乗換検索
controller.hears(['乗り換え','乗換'], ['ambient'], function(bot, message) {
	
})
controller.hears(['じゃんけん','ジャンケン'], ['ambient'], function(bot, message) {
		console.log("USER:"+message.user);
	    bot.startConversation(message,function(err, convo) {
        convo.ask('じゃんけんしよう！じゃじゃじゃじゃーんけーん',[
        {
            default: true,
            callback: function(response, convo) {
				console.log("USER:"+response.user);
				var janken_res = response.text;
				var tem_janken,your_janken;
				var out_str = "";
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
})
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
controller.hears(['help','ヘルプ','説明'], ['ambient'], function(bot, message) {
	var out_str = "わたしが反応する言葉を紹介するね！\n";
	out_str += "・おはなし\n";
	out_str += "お兄ちゃんたちにわたしが色々質問するよ！\n\n";
	out_str += "・@tem_tan おぼえて\n";
	out_str += "お兄ちゃんたちの教えてくれた単語を覚えるよ！\nあまり変なことは覚えさせないでね…^^;\n\n";
	out_str += "・はなして\n";
	out_str += "お兄ちゃんたちが教えてくれた言葉を話すよ\nちょっと恥ずかしいけどね…	///\n\n";
	out_str += "・@tem_tan 動画追加\n";
	out_str += "Youtubeやニコニコとかの動画を覚えるよ！\n覚えたい動画のアドレスを教えてね！\n\n";
	out_str += "・動画表示\n";
	out_str += "わたしが覚えてる動画を表示するよ！\n\n";
	out_str += "・天気教えて\n";
	out_str += "明日と明後日の天気と気温を教えるよ！\n今答えられる所は「東京,大阪,仙台,札幌,網走,名古屋,那覇」だけだから気をつけてね！\n追加したい場所があったらパパに言ってね！\n\n";
	out_str += "・ていちゃ\n";
	out_str += "今のていちゃにいる人たちの数と、どんな人がいるのかを教えるよ！\n\n";
	out_str += "・おしえて\n";
	out_str += "わたしが魔法で持ってきたランダムな単語をお兄ちゃんに教えてあげるよ!\nどんな言葉が飛び出すかは使ってみてのお楽しみだよー！\n";
	out_str += "・mine\n";
	out_str += "マインスイーパを遊ぶことができるよ！\n\"mine,X座標,Y座標\"でも開くことができるよ！\n\n";
	out_str += "・じゃんけん\n";
	out_str += "そのまんんまだけど、私とじゃんけんをして遊べるよ！\n\n";
	bot.reply(message,out_str);
})
// 関数郡

// 指定したIDのユーザ情報を取得できる。コールバック関数なので注意！
// 引数は(bot,message,callback)の形
function getSlackUser(bot,message,callback){
	// Botのアクセストークン取得
	var token = bot.config.token;
	var user_id = message.user;
	// HTTPリクエスト
	var request = require('request');
	var in_url = "https://slack.com/api/users.list?token=" + token;
	var send_option = {
		url: in_url,
		json: true
	};
	request.get(send_option, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('OK: '+ response.statusCode);
			if(body.ok){
				var members = body.members;
				for(var i=0;i<members.length;i++){
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

// Wikipediaランダム
function get_wiki_rand(message){
	var get_url = "https://ja.wikipedia.org/wiki/%E7%89%B9%E5%88%A5:%E3%81%8A%E3%81%BE%E3%81%8B%E3%81%9B%E8%A1%A8%E7%A4%BA"
	var out_str = "お兄ちゃん！「"
	var get_title = "";
	// スクレイピング
	// http://qiita.com/ktty1220/items/64168e8d416d6d8ffb45 参照
	// https://www.npmjs.com/package/cheerio-httpcli
	console.log("test");
	var client = require('cheerio-httpcli');
	var wiki_about = client.fetchSync(get_url);
	console.log(wiki_about.$('title').text());
	get_title = wiki_about.$('title').text();
	get_title = get_title.substr(0,get_title.length - 12);
	out_str += get_title;
	out_str += "」って知ってる？";
	// DBに登録
	var request = require('request');
	var options = {
	  uri: "http://localhost/ajax_test/wiki_add.php",
	  form: { in_value: get_title },
	  json: true
	};
	request.post(options, function(error, response, body){
	  if (!error && response.statusCode == 200) {
		console.log(body);
	  } else {
		console.log('error: '+ response.statusCode);
	  }
	});
	// DB登録ここまで
	return out_str;
}
// ていちゃ情報取得
function get_teicha(message){
	var request = require('request');
	url = 'http://localhost/teicha/get_teicha.php';
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('OK: '+ response.statusCode);
			var res_teicha = createArray(body,1);
			var out_str = "今てい☆ちゃには"+res_teicha[0]+"人いて、"+res_teicha[1]+"人が見てる見たいだよ！\n";
			out_str += "今はこんな人たちがいるみたいだよー！\n";
			console.log(res_teicha);
			console.log("入室数："+res_teicha[0]+"\nROM数："+res_teicha[1]);
			for(var i=0;i<res_teicha[0];i++){
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
	var add_pl_num = "130010";	
	var add_word = "";
	// 天気の場所
	// http://weather.livedoor.com/weather_hacks/rss_feed_list
	switch(pl_num){
		case 0:
			add_pl_num = "130010";
			add_word = "東京"
		break;
		case 1:
			add_pl_num = "270000";
			add_word = "大阪";
		break;
		case 2:
			add_pl_num = "016010";
			add_word = "札幌";
		break;
		case 3:
			add_pl_num = "013010";
			add_word = "網走";
		break;
		case 4:
			add_pl_num = "040010";
			add_word = "仙台";
		break;
		case 5:
			add_pl_num = "230010";
			add_word = "名古屋";
		break;
		case 6:
			add_pl_num = "330010";
			add_word = "岡山";
		break;
		case 7:
			add_pl_num = "471010";
			add_word = "那覇";
		break;
	}
	var request = require('request');
	url = 'http://weather.livedoor.com/forecast/webservice/json/v1?city=';
	url += add_pl_num;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('OK: '+ response.statusCode);
			var tenki_obj = eval("(" + body + ")");
			var out_str = "";
			for(var i=0;i<3;i++){
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
	var add_url = "";
	switch(get_no){
		case 0:
			add_url = 'http://localhost/ajax_test/get.php'
		break;
		case 1:
			add_url = 'http://localhost/ajax_test/music_get.php'
		break;
	}
	var request = require('request');
	request(add_url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		console.log('OK: '+ response.statusCode);
		var temtan_word = createArray(body,0);
		var out_str = '今私が覚えてるのは…\n';
		for(var i = 0;i< temtan_word.length;i++){
			if(get_no == 1 && temtan_word[i].substring(0,4)=="http"){
				// スクレイピング
				// http://qiita.com/ktty1220/items/64168e8d416d6d8ffb45 参照
				// https://www.npmjs.com/package/cheerio-httpcli
				console.log(temtan_word[i]);
				console.log("test");
				var client = require('cheerio-httpcli');
				var movie_about = client.fetchSync(temtan_word[i]);
				console.log(movie_about.$('title').text());
				out_str += movie_about.$('title').text() + "\n";
				out_str += temtan_word[i]+"\n\n";
			}
			else if(get_no == 0){
				out_str += temtan_word[i];
				out_str += "\n";
			}
		}
		out_str += "だよ！お兄ちゃん！";
		bot.reply(message,out_str);
	  } else {
		console.log('error: '+ response.statusCode);
	  }
	})
}

function remember_word(add_value,message,add_no){
	var add_url = "";
	switch(add_no){
		case 0:
			add_url = 'http://localhost/ajax_test/add.php'
		break;
		case 1:
			add_url = 'http://localhost/ajax_test/music_add.php'
			if(add_value.substring(0,5)!="<http"){
				bot.reply(message,'あれぇ〜？動画のURLじゃないみたいだよ〜？');
				return;
			}
			else{
				add_value = add_value.substring(1,add_value.length-1);
			}
		break;
	}
	console.log("add_value:"+add_value);
	var add_str = "in_value=" + add_value;
	var request = require('request');
	var options = {
	  uri: add_url,
	  form: { in_value: add_value },
	  json: true
	};
	console.log("add_str:"+add_str);
	request.post(options, function(error, response, body){
	  if (!error && response.statusCode == 200) {
		console.log(body);
		if(body == "OK"){
			bot.reply(message,'「' +add_value + ' 」を覚えたよ！');
		}
		else{
			bot.reply(message,'「' +add_value + ' 」はもう覚えてるよ？');
		}
	  } else {
		console.log('error: '+ response.statusCode);
	  }
	});
}
function createArray(csvData,num) {
	var tempArray = csvData.split("\n");
	var csvArray = new Array();
	for(var i = 0; i<tempArray.length;i++){
		csvArray[i] = tempArray[i].split(",");
	}
	console.log(csvArray[num]);
	return csvArray[num];
}
//---------------------------マインスイーパ系ここから---------------------------
function play_mine(controller,bot,message){
	var input_mes = message.text.split(",");
	// Inputテスト
	var fs = require('fs');
	var buf = fs.readFileSync("./var/ms.txt");
	// 一つの集合体として読み込み
	var read_str = buf.toString();
	var res_str = analyze_csv(read_str);
	// Mode
	// 0...初期状態
	// 1...ゲーム開始中
	var mode = res_str[0][0];
	var BanSize = 9;
	// Bamen
	// 0...何もなし
	// 1...爆弾
	// Tansa
	// 0...未探査
	// 1...探査済
	var Bamen,Tansa;
	if(mode == 0){
		bot.startConversation(message,function(err, convo) {
			convo.ask("新しいゲームを始めるよ！爆弾の数はいくつにする？\n(10個〜80個)",[
            {
                default: true,
                callback: function(response, convo) {
					var out_str = "";
					var bomb_num = Number(response.text);
					if( bomb_num >= 10 && bomb_num <= 80 ){
						Bamen = set_bomb(bomb_num,BanSize);
						Tansa = new Array();
						for(var i=0;i<BanSize;i++){
							Tansa[i] = new Array();
							for(var j=0;j<BanSize;j++){
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
			var out_str = play_mine_2(input_mes[1],input_mes[2]);
			bot.reply(message,out_str);
		}
		else{
			bot.startConversation(message,function(err, convo) {
				convo.ask("どこのマスを踏む？(X,Y)",[
				{
					default: true,
					callback: function(response, convo) {
						var input_xy = response.text.split(",");
						var input_x = Math.floor(Number(input_xy[0]));
						var input_y = Math.floor(Number(input_xy[1]));
						var out_str = play_mine_2(input_x,input_y);
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
	var fs = require('fs');
	var buf = fs.readFileSync("./var/ms.txt");
	// 一つの集合体として読み込み
	var read_str = buf.toString();
	var res_str = analyze_csv(read_str);
	// Mode
	// 0...初期状態
	// 1...ゲーム開始中
	var mode = res_str[0][0];
	var BanSize = 9;
	// Bamen
	// 0...何もなし
	// 1...爆弾
	// Tansa
	// 0...未探査
	// 1...探査済
	var Bamen,Tansa;
	// 爆弾個数
	var BombNum = 0;
	// 盤サイズ読み込み
	BanSize = Number(res_str[1][0]);
	console.log("BanSize:"+BanSize);
	Bamen = new Array();
	for(var i=0;i<BanSize;i++){
		Bamen[i] = new Array();
		for(var j=0;j<BanSize;j++){
			Bamen[i][j] = res_str[i+2][j];
			if(Bamen[i][j] == 1){
				BombNum++;
			}
		}
	}
	show_ban(Bamen);
	// 探査状況読み込み
	Tansa = new Array();
	for(var i=0;i<BanSize;i++){
		Tansa[i] = new Array();
		for(var j=0;j<BanSize;j++){
			var ni = Number(i)+Number(BanSize)+2;
			Tansa[i][j] = res_str[ni][j];
		}
	}
	show_ban(Tansa);
	// 周辺状況作成
	var Round = new Array();
	for(var i=0;i<BanSize;i++){
		Round[i] = new Array();
		for(var j=0;j<BanSize;j++){
			if(Bamen[i][j] == 1){
				Round[i][j] = "*";
			}
			else{
				var NNum = 0;
				for(var lx = -1;lx<=1;lx++){
					for(var ly = -1;ly<=1;ly++){
						var nx = i + lx;
						var ny = j + ly;
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
	var out_str = "";
	if(input_x >= 0 && (input_x < BanSize) &&
			input_y >= 0 && (input_y < BanSize) ){
		out_str = "X:" + input_x + " Y:" + input_y + "\nB";
		// 盤面表示
		Tansa[input_y][input_x] = 1;
		Tansa = rensa_search(Tansa,Round,input_x,input_y);
		// 現在盤面表示
		var out_str = "0";
		for(var i = 0;i < BanSize;i++){
			out_str += "|" + i;
		}
		out_str += "|\n";
		for(var i = 0;i < BanSize;i++){
			out_str += i;
			for(var j = 0;j < BanSize;j++){
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
		var CloseNum = 0;
		for(var i=0;i<BanSize;i++){
			for(var j=0;j<BanSize;j++){
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
	var out_str = "";
	out_str += mode + "\n";
	out_str += BanSize + "\n";
	for(var i=0;i<BanSize;i++){
		for(var j=0;j<BanSize;j++){
			out_str += Bamen[i][j] + ",";
		}
		out_str += "\n";
	}
	for(var i=0;i<BanSize;i++){
		for(var j=0;j<BanSize;j++){
			out_str += Tansa[i][j] + ",";
		}
		out_str += "\n";
	}
	var fs = require('fs');
	// 盤の出力
	fs.writeFile('./var/ms.txt', out_str , function (err) {
	});
}
function analyze_csv(in_str){
	var line = in_str.split("\n");
	var res_str = new Array();
	for(var i = 0;i < line.length;i++){
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
	var Ban = new Array();
	for(var i=0;i<size;i++){
		Ban[i] = new Array();
		for(var j=0;j<size;j++){
			Ban[i][j] = 0;
		}
	}
	// 爆弾セット
	for(var i=0;i<num;i++){
		var x,y;
		do{
			x = Math.floor( Math.random() * size );
			y = Math.floor( Math.random() * size );
		}while(Ban[x][y] == 1);
		Ban[x][y] = 1;
	}
	return Ban;
}
function show_ban(ban){
	var out_str = "";
	for(var i = 0;i < ban.length;i++){
		for(var j = 0;j < ban[i].length;j++){
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
		for(var lx = -1;lx<=1;lx++){
			for(var ly = -1;ly<=1;ly++){
				var nx = x + lx;
				var ny = y + ly;
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
