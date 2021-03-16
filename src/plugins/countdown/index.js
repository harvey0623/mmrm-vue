export default class Countdown {
   constructor(props) {
      this.deadline = new Date(props.deadline).getTime();
      this.timer = null;
      this.leftTime = 0;
      this.isPause = false;
      this.isFirst = true;
      this.updateList = [];
      this.finishList = [];
   }
   start() {
      if (!this.isFirst) return;
      this.isFirst = false;
      this.execute();
   }
   execute() {
      this.runClock(this.deadline);
      this.timer = setInterval(() => {
         this.runClock(this.deadline);
      }, 1000 / 60);
   }
   runClock(deadline) {
      let diff = deadline - Date.now();
      let day = Math.floor(diff / (1000 * 60 * 60 * 24));
      let hour = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minute = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let second = Math.floor((diff % (1000 * 60)) / 1000);
      let info = { diff, day, hour, minute, second };
      this.updateList.forEach(cb => cb(info));
      if (day === 0 && hour === 0 && minute === 0 && second === 0) {
         clearInterval(this.timer);
         this.finishList.forEach(cb => cb());
      }
      return info;
   }
   pause() {
      if (this.isPause) return;
      this.isPause = true;
      clearInterval(this.timer);
      this.leftTime = this.runClock(this.deadline).diff;
   }
   resume() {
      if (!this.isPause) return;
      this.isPause = false;
      this.deadline = Date.now() + this.leftTime;
      this.execute();
      this.leftTime = 0;
   }
   on(eventName, cb) {
      this[`${eventName}List`].push(cb);
   }
}