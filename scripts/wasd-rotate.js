// компонент для поворота камеры клавишами wasd и стрелками

AFRAME.registerComponent('wasd-rotate', {
  schema: {
    enabled: {type: 'boolean', default: true},
    speed: {type: 'number', default: 3}, // градусов в секунду
  },

  init() {
    this.keys = {};
    this.yaw = null;
    this.pitch = null;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  },

  remove() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  },

  onKeyDown(evt) {
    if (!this.data.enabled) return;
    const code = evt.code;
    const allowed = [
      'KeyW',
      'KeyA',
      'KeyS',
      'KeyD',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
    ];
    if (allowed.includes(code)) {
      this.keys[code] = true;
      evt.preventDefault();
    }
  },

  onKeyUp(evt) {
    const code = evt.code;
    if (this.keys[code]) {
      delete this.keys[code];
      evt.preventDefault();
    }
  },

  tick(time, delta) {
    if (!this.data.enabled || Object.keys(this.keys).length === 0) return;

    // Получаем доступ к yaw и pitch один раз
    if (!this.yaw || !this.pitch) {
      const lookControls = this.el.components['look-controls'];
      if (!lookControls) return;

      this.yaw = lookControls.yawObject.rotation;
      this.pitch = lookControls.pitchObject.rotation;
    }

    const degPerMs = this.data.speed / 1000;
    const dRot = degPerMs * delta;

    // Вращение по Y (влево/вправо)
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) this.yaw.y += dRot;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) this.yaw.y -= dRot;

    // Вращение по X (вверх/вниз)
    if (this.keys['KeyW'] || this.keys['ArrowUp']) this.pitch.x += dRot;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) this.pitch.x -= dRot;

    // Ограничение наклона (pitch)
    const maxPitch = THREE.MathUtils.degToRad(85);
    this.pitch.x = Math.max(-maxPitch, Math.min(maxPitch, this.pitch.x));
  },
});
