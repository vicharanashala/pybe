import * as d3 from 'd3';

export class DomainMapper {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(data) {
    this.container.innerHTML = '';

    if (!data.nodes || data.nodes.length <= 1) {
      this.container.innerHTML = `
        <div class="domain-mapper-empty">
          <p>Complete scenarios to build your learning graph!</p>
        </div>
      `;
      return;
    }

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const linkColor = isLight ? '#cbd5e1' : '#4a5568';
    const textColor = isLight ? '#1e293b' : '#e2e8f0';
    const nodeStroke = isLight ? '#ffffff' : 'rgba(255,255,255,0.2)';

    const width = this.container.clientWidth || 600;
    const height = 400;

    const svg = d3.select(this.container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', linkColor)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5);

    const node = svg.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(this.drag(simulation));

    node.append('circle')
      .attr('r', d => {
        if (d.type === 'user') return 12;
        if (d.type === 'domain') return 18;
        return 10;
      })
      .attr('fill', d => d.color || '#69b3a2')
      .attr('stroke', d => d.type === 'user' ? '#ffffff' : nodeStroke)
      .attr('stroke-width', d => d.type === 'user' ? 3 : 1);

    node.append('text')
      .text(d => d.id)
      .attr('dx', d => d.type === 'user' ? 18 : 14)
      .attr('dy', 4)
      .attr('fill', textColor)
      .attr('font-size', d => d.type === 'user' ? '12px' : '10px')
      .attr('font-weight', d => d.type === 'domain' ? '600' : '400');

    node.append('title')
      .text(d => `${d.id}\nMastery: ${Math.round((d.mastery || 0) * 100)}%`);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  }

  drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }
}