/**
 * splatnet-widget for splatoon3
 * author: @idat_50me
 * https://github.com/idat50me/splatnet-widget
 * 
 * data source: https://splatoon3.ink/
 *              https://splatoonwiki.org/wiki/
 *              https://gist.github.com/phoebethewitch/4b628026cd98b08f895f630f11bcd3c0
 */


/* --- OPTION --- */
const WIDGET_BGCOLOR = "1a1a1a"; // ウィジェットの背景色
const STACK_BGCOLOR = "262626"; // ギアstackの背景色
const POWER_BGCOLOR = Color.black(); // ギアパワーの背景色
const HEADER_COLOR = Color.white(); // ブランド名，販売残り時間の文字色
const HEADER_FONTSIZE = 12; // ブランド名，販売残り時間の文字サイズ
/* -------------- */

const INK_URL = "https://splatoon3.ink/data/gear.json"
const GESOGEAR_URL = "com.nintendo.znca://znca/game/4834290508791808?p=%2Fgesotown%2F";

const FILE_MANAGER = FileManager.iCloud(); // .local() にするとローカルに保存する
const PARENT_DIR = "splatnet-widget/";
const UPD_DATE_FILENAME = "splatnet-widget/update_date.txt";
const UPD_DATE_LOG_FILENAME = "splatnet-widget/update_log.txt";
const RUNTIME_LOG_FILENAME = "splatnet-widget/runtime_log.txt";
const GEARINFO_FILENAME = "splatnet-widget/gearinfo.json";

const WIDGET_PADDING = 10;
const STACK_PADDING = 6;
const GEAR_HEIGHT = 60;
const GEAR_WIDTH = GEAR_HEIGHT;
const POWERS_HEIGHT = 24;
const POWERS_WIDTH = GEAR_WIDTH;
const MAIN_HEIGHT = 24;
const MAIN_WIDTH = MAIN_HEIGHT;
const SUB_HEIGHT = 8;
const SUB_WIDTH = SUB_HEIGHT;
const BRAND_HEIGHT = 20;
const BRAND_WIDTH = BRAND_HEIGHT;

const brandJP = {
	"amiibo": "amiibo",
	"Annaki": "アナアキ",
	"Barazushi": "バラズシ",
	"Cuttlegear": "アタリメイド",
	"Emberz": "シチリン",
	"Emperry": "エンペリー",
	"Firefin": "ホッコリー",
	"Forge": "フォーリマ",
	"Grizzco": "クマサン商会",
	"Inkline": "シグレニ",
	"Krak-On": "クラーゲス",
	"Rockenberg": "ロッケンベルグ",
	"Skalop": "ホタックス",
	"Splash Mob": "ジモン",
	"SquidForce": "バトロイカ",
	"Takoroka": "ヤコ",
	"Tentatek": "アロメ",
	"Toni Kensa": "タタキケンサキ",
	"Zekko": "エゾッコ",
	"Zink": "アイロニック"
};


let unknownImage;
const runtime = new Date();
const DFormat = new DateFormatter();
DFormat.dateFormat = "yyyy-MM-dd HH:mm:ss.SSS";
let runtimeLogText = load_file(RUNTIME_LOG_FILENAME);
if(config.runsInWidget) {
	save_file(RUNTIME_LOG_FILENAME, `${runtimeLogText}\n[Widget,     ${`${Device.systemName()} ${Device.systemVersion()}]`.padEnd(16)} ${DFormat.string(runtime)}`);
}
else {
	save_file(RUNTIME_LOG_FILENAME, `${runtimeLogText}\n[Scriptable, ${`${Device.systemName()} ${Device.systemVersion()}]`.padEnd(16)} ${DFormat.string(runtime)}`);
}

function save_file(filename, str, deleteFile=false) {
	/**filenameにstrを保存する
	 * 
	 * args:
	 * 		filename: 保存先のファイル
	 * 		str: 保存する文字列
	 */
	const filepath = FILE_MANAGER.joinPath(FILE_MANAGER.documentsDirectory(), filename);
	if(FILE_MANAGER.fileExists(filepath)) {
		FILE_MANAGER.downloadFileFromiCloud(filepath); // ローカル保存の場合は多分不要
		if(deleteFile) FILE_MANAGER.remove(filepath); // 上書きが必要なファイルは一旦removeする
	}
	FILE_MANAGER.writeString(filepath, str);
}

function load_file(filename) {
	/**filenameの情報を返す
	 * 
	 * args:
	 * 		filename: ファイル名
	 * 
	 * return:
	 * 		str (String)
	 */
	// filenameの情報を返す
	const filepath = FILE_MANAGER.joinPath(FILE_MANAGER.documentsDirectory(), filename);
	let str = "";
	if(FILE_MANAGER.fileExists(filepath)) {
		FILE_MANAGER.downloadFileFromiCloud(filepath); // ローカル保存の場合は多分不要
		str = FILE_MANAGER.readString(filepath);
	}
	return str;
}

function power_stack_setting(powersStack, powerImage, width, height) {
	/**powersStackにギアパワー単体のStackを追加する
	 * 
	 * args:
	 * 		powersStack: ギアパワー全体のStack
	 * 		powerImage: ギアパワーのimage
	 * 		width: Stackの幅
	 * 		height: Stackの高さ
	 * 
	 * return:
	 * 		powerStack (WidgetStack): ギアパワー単体のStack
	 */
	const powerStack = powersStack.addStack();
	powerStack.size = new Size(width, height);
	powerStack.backgroundColor = POWER_BGCOLOR;
	powerStack.cornerRadius = Math.min(width, height) / 2;
	powerStack.addImage(powerImage);
	return powerStack;
}

async function create_gear_image_element(gearStack, gear) {
	/**gearStackにギア画像のelementを追加する
	 * 
	 * args:
	 * 		gearStack: ギアStack
	 * 		gear: ギア情報のjson
	 * 
	 * return:
	 * 		gearImageEle (WidgetImage): ギア画像のElement
	 */
	const req = new Request(gear.gear.image.url);
	const gearImage = await req.loadImage();
	const gearImageEle = gearStack.addImage(gearImage);
	gearImageEle.imageSize = new Size(GEAR_WIDTH, GEAR_HEIGHT);
	return gearImageEle;
}

async function create_powers_stack(gearStack, gear, limited=false) {
	/**gearStackにギアパワーStackを追加する
	 * 
	 * args:
	 * 		gearStack: ギアStack
	 * 		gear: ギア情報のjson
	 * 		limited: limited仕様の画像配置
	 * 
	 * return:
	 * 		powersStack (WidgetStack): ギアパワー全体のStack
	 */
	const powersStack = gearStack.addStack();
	if(!limited) {
		powersStack.bottomAlignContent();
		powersStack.size = new Size(POWERS_WIDTH, POWERS_HEIGHT);
		let req = new Request(gear.gear.primaryGearPower.image.url);
		const mainImage = await req.loadImage();
		const mainImageStack = power_stack_setting(powersStack, mainImage, MAIN_WIDTH, MAIN_HEIGHT);
		for(let i = 0; i < gear.gear.additionalGearPowers.length; i++) {
			const subImageStack = power_stack_setting(powersStack, unknownImage, SUB_WIDTH, SUB_HEIGHT);
		}
	}
	else {
		powersStack.size = new Size(MAIN_WIDTH, MAIN_HEIGHT+SUB_HEIGHT);
		powersStack.layoutVertically();
		let req = new Request(gear.gear.primaryGearPower.image.url);
		const mainImage = await req.loadImage();
		const mainImageStack = power_stack_setting(powersStack, mainImage, MAIN_WIDTH, MAIN_HEIGHT);
		const subPowersStack = powersStack.addStack();
		for(let i = 0; i < gear.gear.additionalGearPowers.length; i++) {
			const subImageStack = power_stack_setting(subPowersStack, unknownImage, SUB_WIDTH, SUB_HEIGHT);
		}
	}
	return powersStack;
}

async function get_gearinfo() {
	/**販売中のギア情報を返す
	 * 
	 * return:
	 * 		gearinfo (json): 販売中のギア情報
	 */
	let lstupd = load_file(UPD_DATE_FILENAME);
	let gearinfo = {};

	if(lstupd === "" || Math.floor(runtime / (1000*60*60)) - Math.floor(new Date(lstupd) / (1000*60*60)) > 0) {
		// 最終更新日時から00分をまたいでいたらsplatoon3.inkにjsonを取りに行く
		const req = new Request(INK_URL);
		gearinfo = await req.loadJSON();

		lstupd = runtime.toISOString();
		save_file(UPD_DATE_FILENAME, lstupd, true);
		save_file(GEARINFO_FILENAME, JSON.stringify(gearinfo), true);

		let updLogText = load_file(UPD_DATE_LOG_FILENAME);
		save_file(UPD_DATE_LOG_FILENAME, updLogText+"\n"+DFormat.string(runtime));
	}
	else {
		// 取得したばかりならiCloud( or ローカル)にある情報を参照
		const filedata = load_file(GEARINFO_FILENAME);
		gearinfo = JSON.parse(filedata);
	}
	
	return gearinfo;
}

function draw_border(element, color=Color.white()) {
	// debug用 elementの領域確認
	if(config.runsInWidget) return;
	element.borderWidth = 1;
	element.borderColor = color;
}

function create_small_widget() {
	const widget = new ListWidget();
	const textStack = widget.addStack();
	textStack.addSpacer();
	let textEle;
	if(config.widgetFamily === "small") {
		textEle = textStack.addText("サイズを\n大(4x4)にして\n利用して\nください．");
		textEle.minimumScaleFactor = 0.7;
		textEle.lineLimit = 4;
	}
	else {
		textEle = textStack.addText("ウィジェットサイズを大(4x4)にして\n利用してください．");
	}
	textEle.centerAlignText();
	textStack.addSpacer();
	return widget;
}

async function create_widget() {
	const widget = new ListWidget();
	widget.setPadding(WIDGET_PADDING, WIDGET_PADDING, WIDGET_PADDING, WIDGET_PADDING);
	widget.spacing = STACK_PADDING;
	const gearinfo = await get_gearinfo();
	const runtime_after = new Date(runtime.getTime() + 1000*60*60);
	if(runtime_after.getHours() % 2 == 0) runtime_after.setHours(runtime_after.getHours()+1); // 奇数時間に更新
	// 時間ちょうどだと splatoon3.ink の更新が間に合っていないことがあるので30秒遅らせる
	const next_refresh_date = new Date(runtime_after.getFullYear(), runtime_after.getMonth(), runtime_after.getDate(), runtime_after.getHours(), 0, 30);
	console.log(DFormat.string(runtime));
	console.log(DFormat.string(runtime_after));
	console.log(DFormat.string(next_refresh_date));
	widget.refreshAfterDate = next_refresh_date;

	// unknown power image
	let req = new Request(gearinfo.data.gesotown.limitedGears[0].gear.additionalGearPowers[0].image.url);
	unknownImage = await req.loadImage();

	// background
	widget.backgroundColor = new Color(WIDGET_BGCOLOR);

	// pickup brand
	const pickup = gearinfo.data.gesotown.pickupBrand;
	const pickupGears = pickup.brandGears;
	const pickupStack = widget.addStack();
	pickupStack.backgroundColor = new Color(STACK_BGCOLOR);
	pickupStack.setPadding(STACK_PADDING, STACK_PADDING, STACK_PADDING, STACK_PADDING);
	pickupStack.cornerRadius = STACK_PADDING;
	pickupStack.layoutVertically();

	/// header
	const pickup_brand = brandJP[pickup.brand.name];
	const pickup_endtime = pickup.saleEndTime;
	const pickupHeader = pickupStack.addStack();
	const pickupBrandNameEle = pickupHeader.addText(`Pick Up: ${pickup_brand}`);
	pickupBrandNameEle.textColor = HEADER_COLOR;
	pickupBrandNameEle.font = Font.systemFont(HEADER_FONTSIZE);
	pickupHeader.addSpacer();
	const pickupRemainEle = pickupHeader.addDate(new Date(pickup_endtime));
	pickupRemainEle.textColor = HEADER_COLOR;
	pickupRemainEle.font = Font.mediumMonospacedSystemFont(HEADER_FONTSIZE);
	pickupRemainEle.applyTimerStyle();
	pickupRemainEle.rightAlignText();
	draw_border(pickupHeader);
	
	/// gears
	const pickupGearsStack = pickupStack.addStack();
	pickupGearsStack.addSpacer();
	for(const gear of pickupGears) {
		const gearStack = pickupGearsStack.addStack();
		gearStack.layoutVertically();
		gearStack.url = GESOGEAR_URL + gear.id;

		// gear image
		const gearImageEle = await create_gear_image_element(gearStack, gear);

		// power image
		const powersStack = await create_powers_stack(gearStack, gear);

		pickupGearsStack.addSpacer();
	}
	//widget.addSpacer();


	// limited gears
	const limitedGears = gearinfo.data.gesotown.limitedGears;
	for (let i = 0; i < 2; i++) {
		const limitedStack = widget.addStack();
		limitedStack.spacing = STACK_PADDING;
		for (let j = 0; j < 3; j++) {
			const gear = limitedGears[i*3 + j];
			const gearStack = limitedStack.addStack();
			gearStack.backgroundColor = new Color(STACK_BGCOLOR);
			gearStack.setPadding(STACK_PADDING, STACK_PADDING, STACK_PADDING, STACK_PADDING);
			gearStack.cornerRadius = STACK_PADDING;
			gearStack.layoutVertically();
			gearStack.centerAlignContent();
			gearStack.url = GESOGEAR_URL + gear.id;
			draw_border(gearStack, Color.cyan());

			// remaining time
			const headerStack = gearStack.addStack();
			//headerStack.setPadding(STACK_PADDING, STACK_PADDING, 0, STACK_PADDING);
			req = new Request(gear.gear.brand.image.url);
			const brandImage = await req.loadImage();
			const brandImageStack = headerStack.addStack();
			brandImageStack.backgroundColor = Color.white();
			brandImageStack.size = new Size(BRAND_WIDTH, BRAND_HEIGHT);
			const brandImageEle = brandImageStack.addImage(brandImage);
			headerStack.addSpacer();
			const endtime = gear.saleEndTime;
			const remainEle = headerStack.addDate(new Date(endtime));
			remainEle.textColor = HEADER_COLOR;
			remainEle.font = Font.mediumMonospacedSystemFont(HEADER_FONTSIZE);
			remainEle.applyTimerStyle();
			remainEle.rightAlignText();

			const limitedGearStack = gearStack.addStack();
			//limitedGearStack.setPadding(0, STACK_PADDING, STACK_PADDING, STACK_PADDING);
			limitedGearStack.centerAlignContent();
			draw_border(limitedGearStack, Color.red());
			// gear image
			const gearImageEle = await create_gear_image_element(limitedGearStack, gear);
			// power image
			const powersStack = await create_powers_stack(limitedGearStack, gear, true);
			draw_border(gearImageEle);
			draw_border(powersStack);
		}
	}
	
	return widget;
}

(async function() {
	const abs_parent_path = FILE_MANAGER.joinPath(FILE_MANAGER.documentsDirectory(), PARENT_DIR);
	FILE_MANAGER.createDirectory(abs_parent_path, true);
	if(config.runsInWidget) {
		if(config.widgetFamily === "small" || config.widgetFamily === "medium") {
			const widget = create_small_widget();
			Script.setWidget(widget);
		}
		else {
			const widget = await create_widget();
			Script.setWidget(widget);
		}
	}
	else {
		// for debugging
		const widget = await create_widget();
		widget.presentLarge();
	}

	Script.complete();
})();
