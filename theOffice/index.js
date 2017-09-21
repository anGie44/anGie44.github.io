var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send();
    }
}


function pairwise(list) {
	if (list.length < 2) { return []; } 
	var first = list[0], rest = list.slice(1), pairs = rest.map(function(x) { return [first, x]; });
	return pairs.concat(pairwise(rest));
}

Set.prototype.union = function(setB) {
	var union = new Set(this);
	for (var elem of setB) {
		union.add(elem);
	}
	return union;
}

const generateNodesAndLinks = function(episode_guide, key) {
	var links = [];
	var nodes = new Set();
	var links_by_episode = {};

	Object.keys(episode_guide).forEach(key => {
		var characters_in_scene = episode_guide[key].filter(name => name.indexOf(':') != -1).map(name => name.split(":")[0]);
		nodes = nodes.union([...new Set(characters_in_scene)]);
		var char_links = pairwise([...new Set(characters_in_scene)].sort());
		for (i = 0; i < char_links.length; i++) {
			links.push({"source": char_links[i][0], "target": char_links[i][1]});
		}
	});

	var linkCounts = d3.nest()
		.key(function(d) { return d.source; })
		.key(function(d) { return d.target; })
		.rollup(function(v) { return v.length; })
		.entries(links);

	var final_links = [];
	for(var i = 0; i < linkCounts.length; i++) {
		for (var j = 0; j < linkCounts[i]["values"].length; j++) {
			final_links.push({"source": linkCounts[i].key, "target" : linkCounts[i]["values"][j].key, "value": linkCounts[i]["values"][j].value });
		}
	}
	
	links_by_episode[key] = final_links;
	nodes = [...nodes].map(item => ({ "id" : item }));
	return [links_by_episode, nodes];
}