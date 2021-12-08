


const albums = d3.select("#albums")
                .attr("width", "80%")
                .style("margin", "1.8rem 1.8rem 1.8rem 0rem")
                .style("display", "flex")
                .style("flex-flow", "columns")

const albumsOrder = ["red", "fearless", "evermore", "folklore", "lover"]

const albumColors0 = {"red": "236, 112, 99", "fearless": "247, 220, 111", "evermore": "133, 193, 233", "folklore": "88, 214, 141", "lover": "187, 143, 206"}

const albumColors = (album, transparent) => {

    return `rgba(${albumColors0[album]}, ${transparent})`
    
} 

const playlistNumbers = [];

const transformNumber = (number) => {
    
    const string = number.toString();

    let numberString = "";

    for (i in d3.range(string.length)) {

        if (i % 3 === 0 && i != 0) {
            numberString = `${string[-1 + string.length - i ]}.${numberString}`
        } else {
            numberString = `${string[-1 + string.length - i ]}${numberString}`

        }


    }

    return numberString
}

const playlistDimension = {"width": 0, "height": 580}


const playlistFeatures = d3.select("#playlist-features")
                                .attr("width", 480).attr("height", 100);



const playlist = d3.select("#playlist")
                    .attr("height", 880)

const botones = d3.select("#botones")
                    .attr("width", 100)
                    .attr("height", 20);

const orderButton = d3.select("#order-boton");

const orderButton0 = botones.append("text")
                    .attr("x", "50%")
                    .attr("y", "50%")
                    .text("Ordenar")
                    .attr("dominant-baseline", "middle")
                    .attr("text-anchor", "middle");

const playlistNames = d3.select("#playlist-names")
                        .attr("height", playlistDimension.height);

const playlistSvg = d3.select("#playlist-svg")
                        .attr("width", "100%")
                        .attr("height", playlistDimension.height * 1.8)
                        .attr("transform", "translate(-60, -120) scale(0.8)");

const playlistOrder = d3.select("#playlist-order")
                        .on("click", (e) => loadSongs(albumsData))


const info = d3.select("#info")

const trackName = d3.select("#track-name");

const trackNumbers = d3.select("#track-numbers");
                

const trackAlbum = d3.select("#track-album");



const albumClick = (e, d, albumsData) => {

    console.log(d);

    

    if (!d.click) {
        d.click = true;
        d3.select(e.target)
    .style("background-color", albumColors(d.album, 0.8 ))
    } else {
        d.click = false;
        d3.select(e.target)
    .style("background-color", albumColors(d.album, 0.4 ))
    }

    loadSongs(albumsData);
    

}

const features = ["danceability", "energy", "acousticness", "liveness"]


for (f in features) {

    feature = features[f];



    playlistFeatures.append("g")
                    .attr("class", "features")
                    .attr("id", feature)
                    
                    .attr("transform", `translate(${f * 110}, 0)`)
                    .append("text")
                    .text(feature)
                    .attr("fill", "#fff")
                    .style("font-size", "0.8rem")
                    .attr("y", 80)






}

const loadFeatures = (playlistNumbers) => {

    let feature;
    let track;

    const minFeatures = {};
    const maxFeatures = {};
    const featuresData0 = {};

    for (f in features) {

        feature = features[f];

        featuresData0[feature] = []

        minFeatures[feature] = d3.min(playlistNumbers.map((d) => d[feature]))
        maxFeatures[feature] = d3.max(playlistNumbers.map((d) => d[feature]))
        


        



    }

    for (t in playlistNumbers) {

        track = playlistNumbers[t];

        for (f in features) {

            feature = features[f];
            featuresData0[feature].push({"value": track[feature], "playlist": track})

    
        }

        
    }


    for (f in features) {

        feature = features[f];

        playlistFeatures.select(`#${feature}`)
                .selectAll("rect")
                .data(featuresData0[feature], (d) => d.playlist.id)
                .join(
                    (enter) => enter
                        .append("rect")
                        .attr("width", 10)
                        .attr("height", 0)
                        .attr("fill", (d) => albumColors(d.playlist.album, 1))
                        .attr("x", (f) => 10 * (featuresData0[feature].indexOf(f)))
                        .attr("y", (f) => 50 - (10 + ((f.value - minFeatures[feature]) / (maxFeatures[feature] - minFeatures[feature])) * 28 || 10 ))
                        
                        .on("mouseout", (e, d) => {

                            d3.select(e.target)
                                .attr("fill", albumColors(d.playlist.album, 1))
                        })
                        .on("mouseover", (e, d) => {
                            trackName.text(d.playlist.name);
                            trackAlbum.text(d.playlist.album);
                            d3.select(e.target)
                                .attr("fill", albumColors(d.playlist.album, 0.8))

                        }).transition()
                        .attr("height", (d) => {
                            console.log("oli")
                            console.log([d.value, minFeatures[feature], maxFeatures[feature]])
                            return 10 + ((d.value - minFeatures[feature]) / (maxFeatures[feature] - minFeatures[feature])) * 28 || 10 })
                        
                        ,

                        (update) => update 
                        .attr("width", 10)
                        .transition()
                        .attr("height", (d) => 10 + ((d.value - minFeatures[feature]) / (maxFeatures[feature] - minFeatures[feature])) * 28 || 10)
                        .attr("fill", (d) => albumColors(d.playlist.album, 1))
                        .attr("x", (f) => 10 * (featuresData0[feature].indexOf(f)))
                        .attr("y", (f) => 50 - (10 + ((f.value - minFeatures[feature]) / (maxFeatures[feature] - minFeatures[feature])) * 28 || 10 ))

                        ,

                        (exit) => exit 
                                        .remove()
                )
    }

    


    



}


const loadPlaylist = (playlistNumbers) => {
    trackNumbers.selectAll("div")
                            .data(playlistNumbers, (d) => d.id )
                            .join(
                                (enter) => enter 
                                                .append("div")
                                                .attr("class", "track-number")
                                                .text((d) => `${d.track_number}`)
                                                .style("background-color", (d) => albumColors(d.album, 0.4))
                                                .on("click", (e, d) => {
                                                    console.log(playlistNumbers)
                                                    console.log(d);
                                                    playlistNumbers.splice(playlistNumbers.indexOf(d), 1);
                                                    loadPlaylist(playlistNumbers)
                                                })
                                                .on("mouseout", (e, d) => {

                                                    d3.select(e.target)
                                                        .style("background-color", (d) => albumColors(d.album, 0.4))
                                                    
                                                    

                                                })
                                                .on("mouseover", (e, d) => {

                                                    d3.select(e.target)
                                                        .style("background-color", (d) => albumColors(d.album, 0.8))

                                                    trackName.text(d.name);
                                                    trackAlbum.text(d.album);

                                                })
                                                ,

                                (update) => update
                                                    .text((d) => d.track_number)
                                                    .text((d) => `${d.track_number}`)
                                                    .style("background-color", (d) => albumColors(d.album, 0.4))

                                                ,
                                (exit) => exit 
                                                    .remove()
                            )


        loadFeatures(playlistNumbers)


    
}

const loadSongs = (albumsData) => {

    d3.json("taylors_songs.json")
    .then((songsData) => {

        let features = ["danceability", "energy", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness"]

        let featuresValues = {}
        for (i in features) {
            featuresValues[features[i]] = []
        }

        d3.json("taylors_playlist.json")
        .then((playlistData) => {

            let taylorsPlaylist = []

            let albumName;

            for (a in albumsData) {

                if (albumsData[a].click) {
                    albumName = albumsData[a].album;

                    for (s in songsData) {

                        for (i in features) {
                            featuresValues[features[i]].push(songsData[s][features[i]]);
                        }

                        if (songsData[s].album === albumName) {

                            song = songsData[s];

                            

                            for (p in playlistData) {
                                
                                if (playlistData[p].album === albumName ) {

                                

                                    song["plays"] = playlistData[p]["plays"][song.track_number];

                                    taylorsPlaylist.push(song)

                                    

                                }
                            
                            }

                        }
                    }
                }

            }


            console.log(featuresValues);

            let maxFeatures = {}

            let minFeatures = {}


            for (i in features) {


                maxFeatures[features[i]] = d3.max(featuresValues[features[i]])
                minFeatures[features[i]] = d3.min(featuresValues[features[i]])
            }

            
            maxPlay = d3.max(taylorsPlaylist.map((a) => a.plays));
            minPlay = d3.min(taylorsPlaylist.map((a) => a.plays));

            console.log(taylorsPlaylist);

            

            if (orderButton.node().checked) {

                console.log("orderButton")


                taylorsPlaylist = taylorsPlaylist.sort((d, a) =>  a.plays - d.plays);


            }

            let playlistFeaturesData = taylorsPlaylist;

            

            
            const heightRect = (d, taylorsPlaylist) => {

                return 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * taylorsPlaylist.indexOf(d)
            }

            playlist.selectAll("rect")
                    .data(taylorsPlaylist, (d) => d.id)
                    .join(
                        (enter) => enter
                                    .append("rect")
                                    .on("click", (e, d) => {

                                        

                                        if (playlistNumbers.length < 10 && playlistNumbers.indexOf(d) === -1) {
                                            playlistNumbers.push(d);
                                            loadPlaylist(playlistNumbers) }
                                        else if (playlistNumbers.indexOf(d) !== -1){
                                            playlistNumbers.splice(playlistNumbers.indexOf(d), 1)
                                            loadPlaylist(playlistNumbers)
                                        }
                                        
                                    })
                                    .on("mouseout", (e, d) => {

                                        console.log(e);

                                        d3.select(e.target)
                                            .style("opacity", 1)
                                            .attr("height", playlistDimension.height / taylorsPlaylist.length)

                                        playlist.selectAll("rect")
                                                .transition()
                                                .attr("y", (e) => 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * taylorsPlaylist.indexOf(e)) 
                                            

                                                playlistNames.selectAll("text")
                                                .transition()
                                                .attr("y", (e) => 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * (taylorsPlaylist.indexOf(e) + 1) - 4) 
                                                .style("font-size", "0.8rem")

                                        if (taylorsPlaylist.length > 40) {

                                            console.log(playlistNames)

                                            playlistNames.selectAll("text").remove()
                                        }

                                        playlist.selectAll("text").remove()

                                        

                                    })
                                    .on("mouseover", (e, d) => {


                                        d3.select(e.target)
                                                .style("opacity", 0.5)
                                                .attr("height", 28)

                                        playlist.selectAll("rect")
                                                .transition()
                                                .attr("y", (e) => {
                                                    if (taylorsPlaylist.indexOf(e) < taylorsPlaylist.indexOf(d)) {
                                                        return (heightRect(e, taylorsPlaylist) - ((28 - playlistDimension.height / taylorsPlaylist.length)) / 2) 
                                                     } else if (taylorsPlaylist.indexOf(e) === taylorsPlaylist.indexOf(d)) {
                                                         
                                                        return 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * taylorsPlaylist.indexOf(d) - ((28 - playlistDimension.height / taylorsPlaylist.length) / 2) }
                                                    
                                                    else {
                                                        return 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * taylorsPlaylist.indexOf(e) + (28 - playlistDimension.height / taylorsPlaylist.length) / 2
                                                    } 
                                                })

                                        playlistNames.selectAll("text")
                                                .transition()
                                                .attr("y", (e) => {
                                                    if (taylorsPlaylist.indexOf(e) < taylorsPlaylist.indexOf(d)) {
                                                        return (-4 + 28 +  (1 + playlistDimension.height / taylorsPlaylist.length) * (taylorsPlaylist.indexOf(e) + 1)  - ((28 - playlistDimension.height / taylorsPlaylist.length)) / 2) 
                                                     } else if (taylorsPlaylist.indexOf(e) === taylorsPlaylist.indexOf(d)) {
                                                         
                                                        return 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * (1 + taylorsPlaylist.indexOf(d) ) - ((28 - playlistDimension.height / taylorsPlaylist.length) / 2) - 4 }
                                                    
                                                    else {
                                                        return 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * (1 + taylorsPlaylist.indexOf(e)) - 4 + (28 - playlistDimension.height / taylorsPlaylist.length) / 2
                                                    } 
                                                })
                                                .style("font-size", (e) => {
                                                    if (d === e) {
                                                        return "1rem"
                                                    } else {
                                                        return "0.8rem"
                                                    }
                                                })

                                                if (taylorsPlaylist.length > 40) {

                                                    playlistNames.append("text")
                                               
                                                    .attr("height", playlistDimension.height / taylorsPlaylist.length )
                                                    .attr("y", 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * (taylorsPlaylist.indexOf(d) + 1) - 4)
        
                                                    .style("font-size", "1rem")
                                                    .attr("fill", "transparent")
                                                    .attr("x", 0)
                                                    .transition()
                                                    .duration(200)
                                                    
                                                    .attr("x", 60 + 20 +  (((d.plays - minPlay) / (maxPlay - minPlay)) * 400 ) + 8 )
                                                    .text(`${d.track_number}.  ${d.name}` )
                                                    .style("text-overflow", "ellipsis")
                                                    .style("max-width", 80)
                                                    .attr("fill", "#fff")
                                                }


                                                playlist.append("text")
                                                                .attr("height", playlistDimension.height / taylorsPlaylist.length )
                                                                .attr("y", 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * (taylorsPlaylist.indexOf(d) + 1) - 4)
                    
                                                                .style("font-size", "0.8rem")
                                                                .attr("fill", "transparent")
                                                                .attr("x", 8)
                                                                .transition()
                                                                .duration(200)
                                                                
                                                                .text(`${transformNumber(d.plays)}` )
                                                                .style("text-overflow", "ellipsis")
                                                                .style("max-width", 80)
                                                                .attr("fill", "#fff")
                                                                .style("pointer-events", "none")
                                                


                                        /* trackNumber.text(`${d.track_number}`)
                                                .style("background-color", albumColors(d.album, 0.4)); */

                                        trackName.text("").transition().text(d.name).style("color", "#fff")

                                        trackAlbum.text("").transition().text(`${d.album}`).transition().style("color", "#fff");
                                    })
                                    .attr("height", playlistDimension.height / taylorsPlaylist.length)
                                    .attr("y", (d) => 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * taylorsPlaylist.indexOf(d))

                                    .attr("width", 0)
                                    .transition()
                                    .attr("width", (d) => 60 + 20 +  (((d.plays - minPlay) / (maxPlay - minPlay)) * 400 ) )
                                    .attr("fill", (d) => albumColors(d.album, 0.8))
                                    
                                    ,

                        (update) => update
                                    .on("mouseout", (e, d) => {

                                        console.log(e);

                                        d3.select(e.target)
                                            .style("opacity", 1)
                                            .attr("height", playlistDimension.height / taylorsPlaylist.length)

                                        playlist.selectAll("rect")
                                                .transition()
                                                .attr("y", (e) => 28  + (1 + playlistDimension.height / taylorsPlaylist.length) * taylorsPlaylist.indexOf(e)) 
                                            

                                                playlistNames.selectAll("text")
                                                .transition()
                                                .attr("y", (e) => 28 +  (1 + playlistDimension.height / taylorsPlaylist.length) * (taylorsPlaylist.indexOf(e) + 1) - 4) 
                                                .style("font-size", "0.8rem")

                                                if (taylorsPlaylist.length > 40) {

                                                    console.log(playlistNames)
        
                                                    playlistNames.selectAll("text").remove()
                                                }
                                        
                                                playlist.selectAll("text")
                                                            .remove()

                                    })
                                    .on("mouseover", (e, d) => {


                                        d3.select(e.target)
                                                .style("opacity", 0.5)
                                                .attr("height", 28)

                                        playlist.selectAll("rect")
                                                .transition()
                                                .attr("y", (e) => {
                                                    if (taylorsPlaylist.indexOf(e) < taylorsPlaylist.indexOf(d)) {
                                                        return (heightRect(e, taylorsPlaylist) - ((28 - playlistDimension.height / taylorsPlaylist.length) / 2) )
                                                     } else if (taylorsPlaylist.indexOf(e) === taylorsPlaylist.indexOf(d)) {
                                                         
                                                        return 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * taylorsPlaylist.indexOf(d) - ((28 - playlistDimension.height / taylorsPlaylist.length) / 2)  }
                                                    
                                                        else {
                                                            return 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * taylorsPlaylist.indexOf(e) + (28 - playlistDimension.height / taylorsPlaylist.length) / 2
                                                        } 
                                                })


                                                playlistNames.selectAll("text")
                                                .transition()
                                                .attr("y", (e) => {
                                                    if (taylorsPlaylist.indexOf(e) < taylorsPlaylist.indexOf(d)) {
                                                        return (-4 + 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * (taylorsPlaylist.indexOf(e) + 1)  - ((28 - playlistDimension.height / taylorsPlaylist.length)) / 2) 
                                                     } else if (taylorsPlaylist.indexOf(e) === taylorsPlaylist.indexOf(d)) {
                                                         
                                                        return 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * (1 + taylorsPlaylist.indexOf(d) ) - ((28 - playlistDimension.height / taylorsPlaylist.length) / 2) - 4 }
                                                    
                                                    else {
                                                        return 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * (1 + taylorsPlaylist.indexOf(e)) - 4 + (28 - playlistDimension.height / taylorsPlaylist.length) / 2
                                                    } 
                                                })
                                                .style("font-size", (e) => {
                                                    if (d === e) {
                                                        return "1rem"
                                                    } else {
                                                        return "0.8rem"
                                                    }
                                                })


                                                if (taylorsPlaylist.length > 40) {

                                                    playlistNames.append("text")
                                               
                                                    .attr("height", playlistDimension.height / taylorsPlaylist.length )
                                                    .attr("y", 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * (taylorsPlaylist.indexOf(d) + 1) - 4)
        
                                                    .style("font-size", "1rem")
                                                    .attr("fill", "transparent")
                                                    .attr("x", 0)
                                                    .transition()
                                                    .duration(200)
                                                    
                                                    .attr("x", 60 + 20 +  (((d.plays - minPlay) / (maxPlay - minPlay)) * 400 ) + 8 )
                                                    .text(`${d.track_number}.  ${d.name}` )
                                                    .style("text-overflow", "ellipsis")
                                                    .style("max-width", 80)
                                                    .attr("fill", "#fff")
                                                }

                                                playlist.append("text")
                                                                .attr("height", playlistDimension.height / taylorsPlaylist.length )
                                                                .attr("y", 28 +  (1 + playlistDimension.height / taylorsPlaylist.length) * (taylorsPlaylist.indexOf(d) + 1) - 4)
                    
                                                                .style("font-size", "0.8rem")
                                                                .attr("fill", "transparent")
                                                                .attr("x", 8)
                                                                .transition()
                                                                .duration(200)
                                                                
                                                                .text(`${transformNumber(d.plays)}` )
                                                                .style("text-overflow", "ellipsis")
                                                                .style("max-width", 80)
                                                                .attr("fill", "#fff")
                                                                .style("pointer-events", "none")
                                                


                                        /* trackNumber.text(`${d.track_number}`)
                                                .style("background-color", albumColors(d.album, 0.4)); */

                                        trackName.text("").transition().text(d.name).style("color", "#fff")

                                        trackAlbum.text("").transition().text(`${d.album}`).transition().style("color", "#fff");
                                    })
                        
                                    .attr("height", playlistDimension.height / taylorsPlaylist.length)
                                    .transition()
                                    .attr("y", (d) => 28 +  (1 + playlistDimension.height / taylorsPlaylist.length) * taylorsPlaylist.indexOf(d))

                                    .attr("width", (d) => 60 + 20 +  (((d.plays - minPlay) / (maxPlay - minPlay)) * 400 ) )
                                    .attr("fill", (d) => albumColors(d.album, 0.8))
                                    
                                    ,

                        (exit) => exit
                                    .transition()
                                    .attr("width", 0)
                                    .remove()



                    )

            let taylorsPlaylist0 = taylorsPlaylist;

            if (taylorsPlaylist.length > 40) {
                taylorsPlaylist0 = [];
            }



            playlistNames.selectAll("text")
                            .data(taylorsPlaylist0, (d) => d.id)
                            .join(
                                (enter) => enter
                                        .append("text")
                                       
                                        .attr("height", playlistDimension.height / taylorsPlaylist.length )
                                        .attr("x", (d) => 60 + 20 +  (((d.plays - minPlay) / (maxPlay - minPlay)) * 400 ) + 8 )
                                        .attr("y", (d) => 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * (taylorsPlaylist.indexOf(d) + 1) - 4)

                                        .style("font-size", "0.8rem")
                                        .attr("fill", "transparent")
                                        .transition()
                                        .duration(100)
                                        .text((d) => `${d.track_number}.  ${d.name}` )
                                        .style("text-overflow", "ellipsis")
                                        .style("max-width", 80)
                                        .transition()
                                        .attr("fill", "#fff"),

                                (update) => update
                                            .attr("height", playlistDimension.height / taylorsPlaylist.length)
                                            .transition()
                                            .attr("x", (d) => 60 + 20 +  (((d.plays - minPlay) / (maxPlay - minPlay)) * 400 ) + 8 )
                                            .attr("y", (d) => 28 + (1 + playlistDimension.height / taylorsPlaylist.length) * (taylorsPlaylist.indexOf(d) + 1) - 4)
                                            .text((d) => `${d.track_number}.  ${d.name} `)
                                            .style("font-size", "0.8rem")
                                            .style("text-overflow", "ellipsis")
                                            .style("max-width", 80)
                                            .attr("fill", "#fff"),

                                (exit) => exit
                                            .attr("fill", "#fff")
                                            .transition()
                                            .attr("fill", "transparent")
                                            .remove()

                            )

            
        })
    })
}

const loadAlbums = () => {

    d3.json("taylors_albums.json")
    .then((albumsData0) => {

        albumsData = [];

        for (a in albumsData0) {
            albumsData.push({})
        }

        for (a in albumsData0) {
            albumsData0[a]["click"] = false;
            albumsData[albumsOrder.indexOf(albumsData0[a].album)] = albumsData0[a];
        }

        console.log(albumsData);

        d3.select("defs").selectAll("pattern")
                .data(albumsData, (d) => d.album)
                .enter()
                .append("pattern")
                .attr("id", (d) => `image_${d.album}`)
                .attr("patterUnits", "userSpaceOnUse")
                .attr("width", 80)
                .attr("height", 80)
                .append("image")
                .attr("href", (d) => d.images[0].url)
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 80)
                .attr("height", 80)

        /*

        albums.selectAll("g")
               .data(albumsData, (d) => d.album)
               .enter()
               .append("g")
               .attr("class", "album-image")
               .attr("width", "10%")
               .attr("height", 48)
               .attr("x", (d) =>  48 * albumsOrder.indexOf(d.album))
               .style("display", "flex")
               .append("image")
               .attr("class", "album-image")
               .attr("href", (d) => d.images[0].url)
               .attr("width", "50%")
               .attr("height", 48)
               .attr("x", (d) => 48 * albumsOrder.indexOf(d.album) )
               //  .attr("fill", (d) =>  `url(#image_${d.album})`
               //  )

        */
                

        albums.selectAll("div")
                .data(albumsData, (d) => d.album)
                .enter()
                
                .append("div")
                .on("mouseout", (e, d) => {
                    if (!d.click) {
                    d3.select(e.target)
                        .style("background-color", albumColors(d.album, 0.1))
                    }

                })
                .on("mouseover", (e, d) => {
                    console.log(d3.select(e.target))
                    if (!d.click) {
                    d3.select(e.target)
                        .style("background-color", albumColors(d.album, 0.2))
                    }

                })

                .on("click", (e, d) => albumClick(e, d, albumsData))
                .style("background-color", (d) => albumColors(d.album, 0.1))
                .attr("class", "album")
                .append("img")
                
                .attr("src", (d) => d.images[0].url)
                .attr("class", "album-image")

        albums.selectAll("div")
                .append("p")
                .text((d) => d.name)
                
                
    })
    .catch((error) => {
        console.log(error);
    })

    
}

loadAlbums();