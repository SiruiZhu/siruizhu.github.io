const margin = { top: 20, left: 20, right: 40, bottom: 80 }
const height = 800 - margin.top - margin.bottom
const width = 1200 - margin.left - margin.right

var svg = d3
    .select('#line')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.name }))
    .force("charge", d3.forceManyBody().strength(-10))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(23).strength(0.3))

  d3.csv('data/hero-network-small.csv')
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })


function ready(links) {
  // console.log('data looks like', links)
  var nodesByName = {} 

  links.forEach(function(link) {
    link.source = nodeByName(link.hero1)
    link.target = nodeByName(link.hero2)
  })

  // Create the link lines.
  var link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .attr('id', function(d, i) {
        return 'link' + i
      }) 
      .attr('stroke', 'lightgray')
      .on('mouseover', function(d, i) {
        div
          .transition()
          .duration(200)
          .style('opacity', 1) 
        div
          .html('<strong>' + 'Hero name: ' + '</strong>' + d.name )
          .style('left', d3.event.pageX + 30 + 'px')
          .style('top', d3.event.pageY - 28 + 'px')
        d3.select('#link' + i)
          .transition()  
          .attr('opacity', 1)
          .attr('stroke-width', 3.5)
        d3.selectAll('.link')
          .attr('stroke-width', function(l) {
          if (d === l.source || d === l.target)
            return 3.5
          else
            return 1
          })
          .attr('stroke', function(l) {
            if (d === l.source || d === l.target)
              return '#F8D985'
            else
              return 'lightgray'
          })
        d3.selectAll('.nodes')
          .attr('r', function(l) {
          if (d === l.source || d === l.target)
            return 20
          else
            return 12
          })
          .attr('fill', function(l) {
            if (d === l.source || d === l.target)
              return '#F8D985'
            else
              return '#E8593B'
          })
      }) 
      .on('mouseout', function(d, i) {
        div
          .transition()
          .duration(200)
          .style('opacity', 0)
        d3.selectAll('.nodes')
          .attr('fill', '#E8593B')
        d3.select('#link' + i)
          .transition()  
          .attr('opacity', 1)
          .attr('stroke-width', 1)
        d3.selectAll('.link').attr('stroke-width', 1)
            .attr('stroke', 'lightgray')
      })

  var nodes = d3.values(nodesByName)
  // Create the node circles
  var node = svg
      .selectAll(".nodes")
      .append("g")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "nodes")
      .attr('id', function(d, i) {
        return 'hero' + i
      }) 
      .attr("r", 12)
      .attr("fill", '#E8593B')
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
      .on("mouseover", function(d, i) {
        div
          .transition()
          .duration(200)
          .style('opacity', 1) 
        div
          .html('<strong>' + 'Hero name: ' + '</strong>' + d.name )
          .style('left', d3.event.pageX + 30 + 'px')
          .style('top', d3.event.pageY - 28 + 'px')
        svg.selectAll('.link')
          .attr('stroke-width', function(l) {
          if (d === l.source || d === l.target)
            return 3.5
          else
            return 1
          })
          .attr('stroke', function(l) {
            if (d === l.source || d === l.target)
              return '#F8D985'
            else
              return 'lightgray'
          })
          .attr('opacity', function(l) {
          if (d === l.source || d === l.target)
            return 1
          else
            return 0.1
          })

          // I would like to insert an if statement to do all of these things to the connected nodes
          // if(isConnected(d, o)) {
          d3.select(this).select("circle") 
          // Figure out the neighboring node id's with brute strength because the graph is small
          var nodeNeighbors = links.filter(function(link) {
          // Filter the list of links to only those links that have our target 
          // node as a source or target
          return link.source.index === d.index || link.target.index === d.index})
            .map(function(link) {
              // Map the list of links to a simple array of the neighboring indices - this is
              // technically not required but makes the code below simpler because we can use         
              // indexOf instead of iterating and searching ourselves.
              return link.source.index === d.index ? link.target.index : link.source.index })

          // console.log(nodeNeighbors)

          // Reset all circles - we will do this in mouseout also
          svg.selectAll('circle').attr("fill", '#E8593B').attr('opacity', 0.25)
          svg.selectAll('.nodes-label').attr('opacity', 0)
          // now we select the neighboring circles and apply whatever style we want. 
          // Note that we could also filter a selection of links in this way if we want to 
          // Highlight those as well
          svg.selectAll('circle').filter(function(node) {
              // I filter the selection of all circles to only those that hold a node with an
              // index in my listg of neighbors
              return nodeNeighbors.indexOf(node.index) > -1;
            })
              .attr('fill', '#F8D985')
              .attr('opacity', 1)
          svg.selectAll('.nodes-label').filter(function(node) {
              return nodeNeighbors.indexOf(node.index) > -1;
            })
              .attr('opacity', 1)
          d3.select(this).select("circle").attr('fill', '#F8D985').attr('opacity', 1)
          d3.select('#hero' + i)
              .attr('opacity', 1)
              .attr('fill', '#F8D985') 
        })
        .on("mouseout",  function(d, i) { 
            div
              .transition()
              .duration(200)
              .style('opacity', 0)
            svg.selectAll('circle')
               .transition()
               .duration(200) 
               .attr("fill", '#E8593B')
            svg.selectAll('.nodes-label')
               .transition()
               .attr('opacity', 0)
            d3.select(this).select("circle") 
              .transition() 
              .duration(200)
              .attr('r', 12) 
            svg.selectAll('.link')
                .transition()
                .duration(200)
                .attr('stroke-width', 1)
                .attr('stroke', 'lightgray')
                .attr('opacity', 1)
            svg.selectAll('.nodes')
                  .transition()
                  .attr("fill", '#E8593B')
                  .attr('opacity', 1)  
         })

  var nodeText = svg
      .selectAll('.nodes-label')
      .data(nodes)
      .enter()
      .append("text")
      .attr("x", 12)
      .attr("dy", ".35em")
      .attr('class', function(d) {
        var name1 = d.name.toLowerCase().replace(' ', '-')
        return name1.replace('/','-')
      })
      .classed('nodes-label', true)
      .text(d=> d.name)
      .attr('text-anchor', 'middle')
      .attr('font-size', 9)
      .attr('fill', 'white')
      .attr('opacity', 0)
      .style('pointer-events', 'none')

  simulation
      .nodes(nodes)
      .on("tick", ticked)

  simulation.force("link")
      .links(links)

  function ticked() {
   link
        .attr("x1", function(d) { return d.source.x })
        .attr("y1", function(d) { return d.source.y })
        .attr("x2", function(d) { return d.target.x })
        .attr("y2", function(d) { return d.target.y })

    node
        .attr("cx", function(d) { return d.x })
        .attr("cy", function(d) { return d.y })

    nodeText
        .attr('x', function(d) {  return d.x })
        .attr('y', function(d) {  return d.y })
  }

  function nodeByName(name) {
    return nodesByName[name] || (nodesByName[name] = {name: name})
  }

  function isConnected(a, b) {
    return nodesByName[`${a.index},${b.index}`] || nodesByName[`${b.index},${a.index}`] || a.index === b.index
  }

  function fade(opacity) {
    return d => {
      node.style('stroke-opacity', function (o) {
        const thisOpacity = isConnected(d, o) ? 1 : opacity
        this.setAttribute('fill-opacity', thisOpacity)
        return thisOpacity
      })

      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity))

    }
  }
}

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }


