function activePointsClickHandler() {
  var points = document.querySelectorAll('.clickable');
  var camera = document.querySelector('#main-camera');

  points.forEach((point) => {
    point.addEventListener('click', () => {
      console.log('click');
      var pos = Object.values(point.object3D.position).join(' ');
      camera.setAttribute('animation', {
        property: 'position',
        to: {
          x: point.object3D.position.x,
          y: point.object3D.position.y,
          z: point.object3D.position.z,
        },
      });
    });
  });
}

window.addEventListener('load', (evt) => {
  var scene = document.querySelector('a-scene');

  if (scene && scene.hasLoaded) {
    run();
  } else {
    scene.addEventListener('loaded', run);
  }

  function run() {
    activePointsClickHandler();
  }
});
