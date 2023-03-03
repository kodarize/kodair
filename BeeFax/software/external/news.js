////////////////////////////////////////////////////////////////////////////////
// BEEFAX // EXTERNAL: NEWS                                                   //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// External def: Scrolling memory.
let newsScroll = 0;
let featuredNews = new Array();

// Class.
class ExternalNews {

	// Write function.
	static write() {

		// Return if wrong menu.
		if (menuName != "news") return;

		// Clear text.
		BufferInterface.fillText(3, 1, consoleSize.columns-2, 18, " ");

		// Write scroll indicators.
		if (newsScroll > 0) {
			BufferInterface.placeIcon(3, consoleSize.columns-2, "Custom:C:S")
			BufferInterface.placeFCol(3, consoleSize.columns, 26);
		}
		if (newsScroll+16 < featuredNews.length) {
			BufferInterface.placeIcon(20, consoleSize.columns-2, "Custom:D:S")
			BufferInterface.placeFCol(20, consoleSize.columns, 26);
		}

		// Write scrolled text.
		for (let index = newsScroll; index < featuredNews.length && index-newsScroll < 16; index++) {
			BufferInterface.writeString(featuredNews[index], 4+(index-newsScroll), 3);
		}

		// Prompt redraw.
		Display.goDraw();

	}

	// Periodic update function.
	static periodicUpdate() {

		// Return if wrong menu.
		if (menuName != "news") return;

		// Get current events from Wikipedia.
		getJSON("https://en.wikipedia.org/w/api.php", { origin: "*", action: "parse", format: "json", page: "Portal:Current events"}).then(data => {

			// Return if wrong menu.
			if (menuName != "news") return;

			// Parse page HTML.
			const parser = new DOMParser();
			const wikiPage = parser.parseFromString(data.parse.text['*'], "text/html");
			
			// Load & format featured topics.
			let featuredPage = wikiPage.querySelectorAll('div[role="region"][aria-labelledby="Topics_in_the_news"] > ul > li');
			let featured = new Array();
			featuredPage.forEach(li => {
				if (featured.length > 0) featured.push("");
				formatTextWrap(`* ${li.textContent}`, consoleSize.columns - 6).forEach(current => {
					featured.push(current);
				})
			});
			featuredNews = featured;

			// Write topics
			ExternalNews.write();

		});

	}

	// Keypress function.
	static checkKey(e) {

		// Return if wrong menu.
		if (menuName != "news") return;

		// Up/down: Scroll
		if (e.code == "ArrowUp" || e.code == "ArrowDown") {

			// Scroll up.
			if (e.code == "ArrowUp" && newsScroll > 0) {
				newsScroll--;
			}

			// Scroll down.
			if (e.code == "ArrowDown" && newsScroll+16 < featuredNews.length) {
				newsScroll++;
			}

			// Update.
			ExternalNews.write();

		}

	}

}