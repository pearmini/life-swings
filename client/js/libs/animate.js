import Tween from "./tween";

export default function (obj, from, to, duration, delay = 0, type = "Linear") {
  for (let prop in to) {
    setTimeout(
      ((prop) => {
        return () => {
          TweenAnimation(from[prop], to[prop], duration, type, (value) => {
            obj[prop] = value;
          });
        };
      })(prop),
      delay
    );
  }
}

function TweenAnimation(from, to, duration, type, cb) {
  let aniId = 0;
  let lastTime = Date.now();
  const totalDuration = duration * 1000;
  const keys = type.split(".");
  const fn = keys.length === 1 ? Tween[keys[0]] : Tween[keys[0]][keys[1]];
  const step = () => {
    const currentTime = Date.now();
    const currentDuration = currentTime - lastTime;
    if (currentDuration >= totalDuration) {
      cancelAnimationFrame(aniId);
    } else {
      const value = fn(currentDuration, from, to - from, totalDuration);
      cb(value);
      aniId = requestAnimationFrame(step);
    }
  };
  step();
}
