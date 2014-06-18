// Saves options to chrome.storage
function save_options() {
	var default_url = document.getElementById('default-url').value;
	chrome.storage.sync.set({
			default_url: default_url
		},
		function() {
			// Update status to let user know options were saved.
			var status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(function() { status.textContent = ''; }, 750);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get({
		default_url: 'https://app.datadoghq.com/dash/list'
	}, function(items) {
		document.getElementById('default-url').value = items.default_url;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
