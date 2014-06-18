var dogkeeper = 
{
	DEBUG: true,
	default_url: "",
	complete: function()
	{
		console.log("complete", "Sleeping for 20 seconds");
		dogkeeper._load_storage(function() { setTimeout(dogkeeper.main, 20*1000); });
	},

	_debug: function(source, message) {
		if (dogkeeper.DEBUG) {
			console.log(source + ": ", message);
		}
	},

	reload_conditions: [
		function(tab) {
			dogkeeper.debug("cond-0", "title match \"not available$\"")
			if (tab.title.match("not available$"))
			{
				chrome.tabs.reload(tab.id, {"bypassCache": true}, function() {
					console.log("Reload complete!");
				});
				return true;
			}
			return false;
		},
		function(tab) {
			dogkeeper.debug("cond-1", "url == datadog/down.html")
			if (tab.url == "https://app.datadoghq.com/down.html") {
				chrome.tabs.update(tab.id, {"url": "https://app.datadoghq.com/screen/board/2622?tpl_var_scope=production"}, function() {
					console.log("Reload complete!");
				});
				return true;
			}
			return false;
		}
	],
		
	main: function() {
		dogkeeper._debug("main", "running..");
		if (dogkeeper.default_url && chrome.tabs.getAllInWindow) {
			chrome.tabs.getAllInWindow(null, function (tabs) {
				for (var i = 0, tab; tab = tabs[i]; i++) {
					dogkeeper._debug("main", ["checking tab:", tab]);
					if (tab.url.match("datadoghq.com")) {
						dogkeeper._debug("main", "tab url matched datadoghq.com, checking conditions..");
						for (var j = 0, cond; cond = dogkeeper.reload_conditions[j]; j++) {
							dogkeeper._debug("main", cond);
							if (cond(tab))
							{
								dogkeeper._debug("main", "condition matched!")
								return;
							}
						}
					}
				}
			});
		}
		return dogkeeper.complete();
	},

	_load_storage: function(cb) {
		chrome.storage.sync.get("default_url", function(object) {
			console.log("storage retrieved:", object);
			dogkeeper.default_url = object["default_url"];
		});
		cb();
	}
};

dogkeeper._load_storage(dogkeeper.main);
