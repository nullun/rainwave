'use strict';

var PlaylistLists = function() {
	var self = {};
	self.active_list = false;

	var el;
	var lists = {};
	var tabs_el;
	var scroller;

	self.initialize = function() {
		el = $id("lists");
		tabs_el = el.appendChild($el("ul", { "class": "lists_tabs" }));
		scroller = PlaylistScrollbar(el);

		lists.albums = AlbumList(scroller);
		tabs_el.appendChild(lists.albums.tab_el);
		el.appendChild(lists.albums.el);
		self.active_list = lists.albums;

		API.add_callback(lists.albums.update, "all_albums");
		API.add_callback(lists.albums.update, "album_diff");
	};

	self.change_visible_list = function(change_to) {
		if (self.active_list) {
			self.active_list.el.style.display = "none";
			self.active_list.tab_el.className = "";
			self.active_list._scroll_position = scroller.scroll_top;
		}
		self.active_list = change_to;
		self.active_list.el.style.display = "block";
		self.active_list.tab_el.className = "list_tab_open";
		scroller.scroll_to(self.active_list._scroll_position);
	};

	return self;
}();

var PlaylistScrollbar = function(element) {
	var self = Scrollbar.new(element);
	self.parent_update_scroll_height = self.update_scroll_height;
	self.parent_update_handle_position = self.update_handle_position;

	self.update_scroll_height = function(force_height, list_name) {
		if (list_name == PlaylistLists.active_list.list_name) {
			self.parent_update_scroll_height();
		}
	};

	self.update_handle_position = function(list_name) {
		if (list_name == PlaylistLists.active_list.list_name) {
			self.parent_update_handle_position();
		}
	};

	return self;
};

var AlbumList = function(scroller) {
	var self = SearchList("album_list", "id", "name", "name_searchable", scroller);
	self.tab_el = $el("li", { "textContent": $l("album_list") });
	self.tab_el.addEventListener("click", function() { PlaylistLists.change_visible_list(list); }, false);

	self.draw_entry = function(item) {
		var item_el = document.createElement("div", { "class": "searchlist_entry" });
		item._rating = AlbumRating(item);
		item_el.appendChild(item._rating.el);
		item_el.appendChild($el("div", { "class": "searchlist_name", "textContent": item.name }));
		return item_el;
	};

	self.update_item_element = function(item) {
		// pass for now
	};

	return self;
};