var deck = require('deck'); //for good random selection

var rules = [
  "Ferengi Rule of Acquisition #1: Once you have their money, you never give it back.",
  "Ferengi Rule of Acquisition #3: Never pay more for an acquisition than you have to.",
  "Ferengi Rule of Acquisition #6: Never allow family to stand in the way of opportunity.",
  "Ferengi Rule of Acquisition #7: Keep your ears open.",
  "Ferengi Rule of Acquisition #8: Small print leads to large risk.",
  "Ferengi Rule of Acquisition #9: Opportunity plus instinct equals profit.",
  "Ferengi Rule of Acquisition #10: Greed is eternal.",
  "Ferengi Rule of Acquisition #13: Anything worth doing is worth doing for money.",
  "Ferengi Rule of Acquisition #16: A deal is a deal... until a better one comes along.",
  "Ferengi Rule of Acquisition #17: A contract is a contract is a contract... but only between Ferengi.",
  "Ferengi Rule of Acquisition #18: A Ferengi without profit is no Ferengi at all.",
  "Ferengi Rule of Acquisition #19: Satisfaction is not guaranteed.",
  "Ferengi Rule of Acquisition #21: Never place friendship above profit.",
  "Ferengi Rule of Acquisition #22: A wise man can hear profit in the wind.",
  "Ferengi Rule of Acquisition #27: There is nothing more dangerous than an honest businessman",
  "Ferengi Rule of Acquisition #28: Whisper your way to success.",
  "Ferengi Rule of Acquisition #31: Never make fun of a Ferengi's mother.",
  "Ferengi Rule of Acquisition #33: It never hurts to suck up to the boss.",
  "Ferengi Rule of Acquisition #34: War is good for business.",
  "Ferengi Rule of Acquisition #35: Peace is good for business.",
  "Ferengi Rule of Acquisition #40: She can touch your lobes, but never your latinum.",
  "Ferengi Rule of Acquisition #41: Profit is its own reward.",
  "Ferengi Rule of Acquisition #44: Never confuse wisdom with luck.",
  "Ferengi Rule of Acquisition #47: Never trust a man wearing a better suit than your own.",
  "Ferengi Rule of Acquisition #48: The bigger the smile, the sharper the knife.",
  "Ferengi Rule of Acquisition #52: Never ask when you can take.",
  "Ferengi Rule of Acquisition #57: Good customers are as rare as latinum. Treasure them.",
  "Ferengi Rule of Acquisition #58: There is no substitute for success.",
  "Ferengi Rule of Acquisition #59: Free advice is seldom cheap.",
  "Ferengi Rule of Acquisition #60: Keep your lies consistent.",
  "Ferengi Rule of Acquisition #62: The riskier the road, the greater the profit.",
  "Ferengi Rule of Acquisition #65: Win or lose, there's always Hupyrian beetle snuff.",
  "Ferengi Rule of Acquisition #75: Home is where the heart is, but the stars are made of latinum.",
  "Ferengi Rule of Acquisition #76: Every once in a while, declare peace. It confuses the hell out of your enemies.",
  "Ferengi Rule of Acquisition #79: Beware of the Vulcan greed for knowledge.",
  "Ferengi Rule of Acquisition #82: The flimsier the product, the higher the price.",
  "Ferengi Rule of Acquisition #85: Never let the competition know what you're thinking.",
  "Ferengi Rule of Acquisition #89: Ask not what your profits can do for you, but what you can do for your profits.",
  "Ferengi Rule of Acquisition #94: Females and finances don't mix.",
  "Ferengi Rule of Acquisition #97: Enough ... is never enough.",
  "Ferengi Rule of Acquisition #98: Every man has his price.",
  "Ferengi Rule of Acquisition #99: Trust is the biggest liability of all.",
  "Ferengi Rule of Acquisition #102: Nature decays, but latinum lasts forever.",
  "Ferengi Rule of Acquisition #103: Sleep can interfere with your lust for latinum.",
  "Ferengi Rule of Acquisition #104: Faith moves mountains ... of inventory.",
  "Ferengi Rule of Acquisition #106: There is no honor in poverty.",
  "Ferengi Rule of Acquisition #109: Dignity and an empty sack is worth the sack.",
  "Ferengi Rule of Acquisition #111: Treat people in your debt like family... exploit them.",
  "Ferengi Rule of Acquisition #112: Never have sex with the boss's sister.",
  "Ferengi Rule of Acquisition #113: Always have sex with the boss.",
  "Ferengi Rule of Acquisition #121: Everything is for sale, even friendship.",
  "Ferengi Rule of Acquisition #123: Even a blind man can recognize the glow of latinum.",
  "Ferengi Rule of Acquisition #125: You can't make a deal if you're dead.",
  "Ferengi Rule of Acquisition #139: Wives serve, brothers inherit.",
  "Ferengi Rule of Acquisition #141: Only fools pay retail.",
  "Ferengi Rule of Acquisition #144: There's nothing wrong with charity... as long as it winds up in your pocket.",
  "Ferengi Rule of Acquisition #162: Even in the worst of times, someone turns a profit.",
  "Ferengi Rule of Acquisition #168: Whisper your way to success.",
  "Ferengi Rule of Acquisition #177: Know your enemies... but do business with them always.",
  "Ferengi Rule of Acquisition #181: Not even dishonesty can tarnish the shine of profit.",
  "Ferengi Rule of Acquisition #189: Let others keep their reputation. You keep their latinum.",
  "Ferengi Rule of Acquisition #190: Hear all, trust nothing.",
  "Ferengi Rule of Acquisition #192: Never cheat a Klingon ... unless you can get away with it.",
  "Ferengi Rule of Acquisition #194: It's always good to know about new customers before they walk in your door.",
  "Ferengi Rule of Acquisition #202: The justification for profit is profit.",
  "Ferengi Rule of Acquisition #203: New customers are like razor-toothed gree worms. They can be succulent, but sometimes they bite back.",
  "Ferengi Rule of Acquisition #208: Sometimes the only thing more dangerous than the question is an answer.",
  "Ferengi Rule of Acquisition #211: Employees are the rungs on the ladder of success. Don't hesitate to step on them.",
  "Ferengi Rule of Acquisition #214: Never begin a negotiation on an empty stomach.",
  "Ferengi Rule of Acquisition #217: You can't free a fish from water.",
  "Ferengi Rule of Acquisition #218: Always know what you're buying.",
  "Ferengi Rule of Acquisition #223: Beware the man who doesn't make time for oo-mox.",
  "Ferengi Rule of Acquisition #229: Latinum lasts longer than lust.",
  "Ferengi Rule of Acquisition #236: You can't buy fate.",
  "Ferengi Rule of Acquisition #239: Never be afraid to mislabel a product.",
  "Ferengi Rule of Acquisition #242: More is good. All is better.",
  "Ferengi Rule of Acquisition #255: A wife is a luxury ... a smart accountant a necessity.",
  "Ferengi Rule of Acquisition #261: A wealthy man can afford anything except a conscience.",
  "Ferengi Rule of Acquisition #266: When in doubt, lie.",
  "Ferengi Rule of Acquisition #263: Never let doubt interfere with your lust for latinum.",
  "Ferengi Rule of Acquisition #284: Deep down, everyone's a Ferengi.",
  "Ferengi Rule of Acquisition #285: No good deed ever goes unpunished.",
]


exports.respond = function(theRequest, callback){
   if (theRequest.text && !theRequest.name.toLowerCase().startsWith('robot') &&
   		(theRequest.text.trim().toLowerCase().indexOf("ferengi") >= 0 ||
   		 theRequest.text.trim().toLowerCase().indexOf("money") >= 0 ||
   		 theRequest.text.trim().toLowerCase().indexOf("profit") >= 0 ||
   		 theRequest.text.trim().toLowerCase().indexOf("discount") >= 0 ||
   		 theRequest.text.trim().toLowerCase().indexOf("sale") >= 0){
   			callback(true,deck.pick(rules));
 	} else {
   		callback(false);
 	}
}


