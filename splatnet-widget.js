// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: magic;
/**
 * splatnet-widget for splatoon3
 * author: @idat_50me
 * 
 * data source: splatoon3.ink
 */

const INK_URL = "https://splatoon3.ink/data/gear.json"

const FILE_MANAGER = FileManager.iCloud(); // .local() にするとローカルに保存する
const PARENT_DIR = "splatnet-widget/";
const UPD_DATE_FILENAME = "splatnet-widget/update_date.txt";
const GEARINFO_FILENAME = "splatnet-widget/gearinfo.json";


// image size
const GEAR_HEIGHT = 65;
const GEAR_WIDTH = GEAR_HEIGHT;
const POWER_HEIGHT = 25;
const POWER_WIDTH = GEAR_WIDTH;
const SUBPOWER_HEIGHT = 10;
const SUBPOWER_WIDTH = SUBPOWER_HEIGHT;


function save_file(filename, str) {
	// filenameにstrを保存
	const filepath = FILE_MANAGER.joinPath(FILE_MANAGER.documentsDirectory(), filename);
	if(FILE_MANAGER.fileExists(filepath)) FILE_MANAGER.remove(filepath); // txtファイルは上書きされない？
	FILE_MANAGER.writeString(filepath, str);
}

function load_file(filename) {
	// filenameの情報を返す
	const filepath = FILE_MANAGER.joinPath(FILE_MANAGER.documentsDirectory(), filename);
	return FILE_MANAGER.fileExists(filepath) ? FILE_MANAGER.readString(filepath) : "";
}

async function get_gearinfo() {
	// 販売中のギア情報をjson形式で返す
	let lstupd = load_file(UPD_DATE_FILENAME);
	let gearinfo = {};

	if(lstupd === "" || Math.floor(new Date() / (1000*60*60)) - Math.floor(new Date(lstupd) / (1000*60*60)) > 0) {
		const req = new Request(INK_URL);
		gearinfo = await req.loadJSON();

		lstupd = new Date().toISOString();
		save_file(UPD_DATE_FILENAME, lstupd);
		save_file(GEARINFO_FILENAME, JSON.stringify(gearinfo));
	}
	else {
		const filedata = load_file(GEARINFO_FILENAME);
		gearinfo = JSON.parse(filedata);
	}
	
	return gearinfo;
}

async function create_widget() {
	const widget = new ListWidget();
	const gearinfo = await get_gearinfo();
	const now_date = new Date();

	// background
	widget.backgroundColor = new Color("1a1a1a");

	// pickup brand
	const pickup = gearinfo.data.gesotown.pickupBrand;
	const pickupGears = pickup.brandGears;

	/// remaining time
	const pickup_endtime = pickup.saleEndTime;
	const remain_min = Math.floor(new Date(pickup_endtime) / (1000*60)) - Math.floor(now_date / (1000*60));
	const pickupRemainStack = widget.addText(`${Math.floor(remain_min / 60)}h${remain_min % 60}m`);
	pickupRemainStack.rightAlignText();
	pickupRemainStack.textColor = Color.white();
	pickupRemainStack.font = Font.systemFont(13);
	
	const pickupStack = widget.addStack();
	pickupStack.addSpacer();
	for(const gear of pickupGears) {
		console.log("gear: " + gear.gear.name);
		const gearStack = pickupStack.addStack();
		gearStack.layoutVertically();

		// gear image
		let req = new Request(gear.gear.image.url);
		const gearImage = await req.loadImage();
		console.log("load image");
		const gearImageEle = gearStack.addImage(gearImage);
		gearImageEle.imageSize = new Size(GEAR_WIDTH, GEAR_HEIGHT);

		// power image
		const powerStack = gearStack.addStack();
		powerStack.bottomAlignContent();
		powerStack.size = new Size(POWER_WIDTH, POWER_HEIGHT);
		req = new Request(gear.gear.primaryGearPower.image.url);
		const mainImage = await req.loadImage();
		const mainImageEle = powerStack.addImage(mainImage);
		for(const subpower of gear.gear.additionalGearPowers) {
			req = new Request(subpower.image.url);
			const subImage = await req.loadImage();
			const subImageEle = powerStack.addImage(subImage);
			subImageEle.imageSize = new Size(SUBPOWER_WIDTH, SUBPOWER_HEIGHT);
		}
		pickupStack.addSpacer();
	}


	console.log("created widget");
	return widget;
}


//const d = new Date(2022,9,9,17,0,0);
//const lstupd = 0;
//console.log(d, lstupd);
//console.log(Math.floor(d / (1000*60*60)) - Math.floor(lstupd / (1000*60*60)));

async function func() {
	const req = new Request(INK_URL);
	let gearinfo = await req.loadJSON();
	console.log(gearinfo);
}

(async function() {
	const abs_parent_path = FILE_MANAGER.joinPath(FILE_MANAGER.documentsDirectory(), PARENT_DIR);
	FILE_MANAGER.createDirectory(abs_parent_path, true);
	const widget = await create_widget();
	Script.setWidget(widget);

	Script.complete();
})();
