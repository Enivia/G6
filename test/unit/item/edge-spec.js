const expect = require('chai').expect;
const G = require('@antv/g');
const Node = require('../../../src/item/node');
const Edge = require('../../../src/item/edge');
const div = document.createElement('div');
div.id = 'edge-spec';
document.body.appendChild(div);

const canvas = new G.Canvas({
  containerId: 'edge-spec',
  width: 600,
  height: 600
});

describe('edge test, with circle', () => {
  const aNode = new Node({
    model: {
      id: 'a',
      x: 100,
      y: 100,
      size: 20,
      shape: 'circle'
    },
    group: canvas.addGroup()
  });

  const bNode = new Node({
    model: {
      id: 'b',
      x: 200,
      y: 200,
      size: 20,
      shape: 'circle'
    },
    group: canvas.addGroup()
  });

  const cNode = new Node({
    model: {
      id: 'c',
      x: 300,
      y: 200,
      size: 20,
      shape: 'circle'
    },
    group: canvas.addGroup()
  });
  let edge;
  it('init', () => {
    const group = canvas.addGroup();
    edge = new Edge({
      model: {

      },
      source: aNode,
      target: bNode,
      group
    });

    expect(group.getCount()).eql(1);
    canvas.draw();
  });

  it('get model', () => {
    const model = edge.getModel();
    expect(model.source).eql('a');
    expect(model.target).eql('b');
  });

  it('node edges', () => {
    expect(aNode.getEdges().length).eql(1);
    expect(aNode.getEdges()[0]).eql(edge);
    expect(bNode.getEdges().length).eql(1);
    const outEdges = aNode.getOutEdges();
    expect(outEdges.length).eql(1);
    expect(bNode.getOutEdges().length).eql(0);
    expect(aNode.getInEdges().length).eql(0);
    expect(bNode.getInEdges().length).eql(1);
  });

  it('update', () => {
    edge.update({
      color: 'red'
    });
    const shape = edge.get('keyShape');
    expect(shape.attr('stroke')).eql('red');
  });

  it('move node nad refresh', () => {
    const shape = edge.get('keyShape');
    const intersectPoint = aNode.getLinkPoint(bNode.getModel());
    expect(shape.attr('path')[0]).eqls([ 'M', intersectPoint.x, intersectPoint.y ]);
    aNode.update({
      x: 150,
      y: 100
    });
    edge.refresh();

    const intersectPoint1 = aNode.getLinkPoint(bNode.getModel());
    expect(shape.attr('path')[0]).eqls([ 'M', intersectPoint1.x, intersectPoint1.y ]);
    expect(intersectPoint).not.eqls(intersectPoint1);
    canvas.draw();
  });

  it('change source', () => {
    const shape = edge.get('keyShape');
    const intersectPoint = aNode.getLinkPoint(bNode.getModel());
    expect(shape.attr('path')[0]).eqls([ 'M', intersectPoint.x, intersectPoint.y ]);
    edge.setSource(cNode);
    edge.refresh();
    const intersectPoint1 = cNode.getLinkPoint(bNode.getModel());
    expect(shape.attr('path')[0]).eqls([ 'M', intersectPoint1.x, intersectPoint1.y ]);
    expect(intersectPoint).not.eqls(intersectPoint1);

    expect(aNode.getEdges().length).eql(0);
    expect(cNode.getEdges().length).eql(1);
    canvas.draw();
  });

  it('change target', () => {
    const shape = edge.get('keyShape');
    const intersectPoint = bNode.getLinkPoint(cNode.getModel());
    expect(shape.attr('path')[1]).eqls([ 'L', intersectPoint.x, intersectPoint.y ]);
    edge.setTarget(aNode);
    edge.refresh();
    const intersectPoint1 = aNode.getLinkPoint(cNode.getModel());
    expect(shape.attr('path')[1]).eqls([ 'L', intersectPoint1.x, intersectPoint1.y ]);
    expect(intersectPoint).not.eqls(intersectPoint1);

    expect(bNode.getEdges().length).eql(0);
    expect(aNode.getEdges().length).eql(1);

  });

  it('set source and target to plain objects', () => {
    const shape = edge.get('keyShape');
    const point1 = { x: 50, y: 50 };
    const point2 = { x: 150, y: 150 };
    edge.setSource(point1);
    edge.refresh();
    expect(shape.attr('path')[0]).eqls([ 'M', point1.x, point1.y ]);

    edge.setTarget(point2);
    edge.refresh();
    expect(shape.attr('path')[1]).eqls([ 'L', point2.x, point2.y ]);
    const model = edge.getModel();
    expect(model.source).eql(point1);
    expect(model.target).eql(point2);
    canvas.draw();
  });

  it('states', () => {
    const shape = edge.get('keyShape');
    expect(shape.attr('strokeOpacity')).eql(1);
    edge.setState('active', false);
    expect(shape.attr('strokeOpacity')).eql(1);
    edge.setState('active', true);
    expect(shape.attr('strokeOpacity')).eql(0.8);

    edge.setState('active', false);
    expect(shape.attr('strokeOpacity')).eql(1);
  });

  it('destroy', () => {
    edge.setSource(aNode);
    edge.setTarget(bNode);
    expect(aNode.getEdges().length).eql(1);
    expect(bNode.getEdges().length).eql(1);

    const group = edge.get('group');
    edge.destroy();
    expect(aNode.getEdges().length).eql(0);
    expect(bNode.getEdges().length).eql(0);
    expect(group.get('destroyed')).eql(true);

  });
});

describe('edge test, with ellipse', () => {
  const aNode = new Node({
    id: 'a',
    model: {
      x: 100,
      y: 100,
      size: [ 20, 40 ],
      shape: 'ellipse'
    },
    group: canvas.addGroup()
  });

  const bNode = new Node({
    id: 'b',
    model: {
      x: 200,
      y: 200,
      size: [ 20, 40 ],
      shape: 'circle'
    },
    group: canvas.addGroup()
  });

  it('init', () => {
    const group = canvas.addGroup();
    const edge = new Edge({
      model: {

      },
      source: aNode,
      target: bNode,
      group
    });

    expect(group.getCount()).eql(1);
    const shape = edge.get('keyShape');
    const intersectPoint = aNode.getLinkPoint(bNode.getModel());
    expect(shape.attr('path')[0]).eqls([ 'M', intersectPoint.x, intersectPoint.y ]);
    canvas.draw();
  });

  it('clear', () => {

  });
});

describe('edge test, anchors', () => {

  let edge;
  it('test link points', () => {
    const aNode = new Node({
      id: 'a',
      model: {
        x: 100,
        y: 100,
        size: 20,
        shape: 'circle',
        style: {
          lineWidth: 0,
          fill: 'red'
        },
        anchorPoints: [
          [ 0.5, 0 ], [ 1, 0.5 ], [ 0.5, 1 ], [ 0, 0.5 ]
        ]
      },
      group: canvas.addGroup()
    });

    const bNode = new Node({
      id: 'b',
      model: {
        x: 200,
        y: 200,
        size: 20,
        shape: 'circle',
        style: {
          lineWidth: 0,
          fill: 'blue'
        },
        anchorPoints: [
          [ 0.5, 0 ], [ 1, 0.5 ], [ 0.5, 1 ], [ 0, 0.5 ]
        ]
      },
      group: canvas.addGroup()
    });
    const group = canvas.addGroup();
    edge = new Edge({
      model: {

      },
      source: aNode,
      target: bNode,
      group
    });

    expect(group.getCount()).eql(1);
    const shape = edge.get('keyShape');
    let path = shape.attr('path');
    expect(path[0]).eqls([ 'M', 110, 100 ]);
    expect(path[1]).eqls([ 'L', 200, 190 ]);

    bNode.update({ x: 100, y: 200 });
    edge.refresh();
    path = shape.attr('path');
    expect(path[0]).eqls([ 'M', 100, 110 ]);
    expect(path[1]).eqls([ 'L', 100, 190 ]);
    edge.update({ targetAnchor: 2 });
    path = shape.attr('path');

    expect(path[0]).eqls([ 'M', 100, 110 ]);
    expect(path[1]).eqls([ 'L', 100, 210 ]);

    canvas.draw();
  });

  it('with control points', () => {
    edge.update({ targetAnchor: null, shape: 'polyline', controlPoints: [{ x: 150, y: 100 }] });
    const shape = edge.get('keyShape');
    const path = shape.attr('path');
    expect(path[0]).eqls([ 'M', 110, 100 ]);
    expect(path[1]).eqls([ 'L', 150, 100 ]);
    expect(path[2]).eqls([ 'L', 100, 190 ]);
    canvas.draw();
  });

});
