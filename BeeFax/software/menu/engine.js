////////////////////////////////////////////////////////////////////////////////
// BEEFAX // MENU ENGINE                                                      //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// External: States.
var menuName;
var menuUpdate = null;
var currentItem;
var currentTitle;
var currentUpdate;
var currentInterval = null;
var currentWait;
let currentWaitT = null;
var currentUpdateOnNav;
var currentData;
var menuItems;
var updateToggle = false;
let musicErrShutUp = null;

// Class.
class MenuEngine {

	// Initialization child function.
	static init() {
		if (window.location.hash) {
			let start = window.location.hash.substr(1);
			this.goMenu(start);
		} else {
			if (navigator.onLine == false) {
				networkErrorTriggered();
			} else {
				this.goMenu("main");
			}
		}
	}

	// State check child function.
	static checkState() {

		// Change menu if hash and menu name don't match.
		if (window.location.hash.substr(1) != menuName) {
			this.goMenu(window.location.hash.substr(1));
		}

	}

	// Menu navigator.
	static goMenu(newMenuName, preSelect=-1) {

		// Evaluate validation.
		if ((MenuData.menus[newMenuName] == undefined) ||
			(!MenuData.menus[newMenuName]) ||
			(!MenuData.menus[newMenuName].data[preSelect] && preSelect>=0)
		) {
			displayMode = "error";
			bgmPlayer.pause();
			if (musicErrShutUp == null) musicErrShutUp = setTimeout(() => {
				bgmPlayer.pause();
				musicErrShutUp = null;
			}, 1750);
			return;
		}
		if (musicErrShutUp != null) {
			clearTimeout(musicErrShutUp);
			musicErrShutUp = null;
		}
		displayMode = defaultDisplayMode;

		// Clear previous periodic update.
		if (menuUpdate) {
			clearInterval(menuUpdate);
		}

		// Load values.
		menuName = newMenuName;
		currentItem = (preSelect>=0 ? preSelect : 0);
		const currentObject = MenuData.menus[menuName];
		currentTitle = currentObject.title;
		currentUpdate = currentObject.periodicUpdate;
		currentInterval = currentObject.periodicInterval;
		currentWait = currentObject.initialWait;
		currentUpdateOnNav = currentObject.updateOnNav;
		currentData = currentObject.data;
		menuItems = new Array();

		// Update URL params.
		window.location.hash = `#${newMenuName}`;

		// Clear buffers.
		BufferInterface.resetAll();

		// Write title.
		BufferInterface.fillRect(0, 0, consoleSize.columns, 1, currentTitle.bCol);
		BufferInterface.writeString(currentTitle.text.toUpperCase(), 0, 1, currentTitle.fCol);

		// Write menu data.
		currentData.forEach((item) => {
			item.write();
			let type = item.getType();
			if (
				type == "item.menu" ||
				type == "item.input"
			) menuItems.push(item);
		});
		
		// Select default item.
		menuItems[currentItem].select();
		BufferInterface.setSelectionColors(currentTitle.fCol, currentTitle.bCol);

		// Load new periodic update.
		if (currentWaitT) clearInterval(currentWaitT);
		currentWaitT = setTimeout(() => {
			currentUpdate();
			menuUpdate = setInterval(() => {
				updateToggle = !updateToggle;
				currentUpdate();
			}, currentInterval);
		}, currentWait);

	}

	// Child keypress processor.
	static checkKey(e) {

		// Normal/test mode.
		if (displayMode == "normal" || displayMode == "test") {

			// Up, Down: Move.
			if (e.code == "ArrowUp" || e.code == "ArrowDown") {
				let lastItem = currentItem;
				if (e.code == "ArrowUp") currentItem--;
				if (e.code == "ArrowDown") currentItem++;
				if (currentItem < 0) currentItem = menuItems.length - 1;
				if (currentItem >= menuItems.length) currentItem = 0;
				if (lastItem != currentItem) {
					menuItems[lastItem].deselect();
					menuItems[currentItem].select();
				}
			}

			// Enter: Menu Item Callback.
			else if (e.code == "Enter") {
				let selectedItem = menuItems[currentItem];
				if (selectedItem.getType() == "item.menu") selectedItem.doCallback();
			}

			// Text Characters, Backspace: Input Item Callback.
			else if (
				(
					(e.which == 8 || e.which == 32) ||
					(e.which >= 48 && e.which <= 90) ||
					(e.which >= 96 && e.which <= 111) ||
					(e.which >= 160 && e.which <= 165) ||
					(e.which == 170 || e.which == 171 || e.which == 173) ||
					(e.which >= 186 && e.which <= 223)
				) && (
					!(e.ctrlKey || e.metaKey)
				)
			) {
				let selectedItem = menuItems[currentItem];
				if (selectedItem.getType() == "item.input") selectedItem.doUpdate(e);
			}

		}

		// Error mode.
		else if (displayMode == "error") {
			
			// Enter, Space: Reset.
			if (e.code == "Space" || e.code == "Enter") {
				errorMessage = defaultErrorMessage;
				ExternalHeadsUp.performGeolocation();
				Music.nextTrack();
				this.goMenu("main");
				if (navigator.onLine == false) networkErrorTriggered();
			}

		}

	}

}