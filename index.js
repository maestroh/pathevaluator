var Rx = require('rx');

module.exports = function(set, get, del){
	var keyChangedSubject = new Rx.Subject();

	return {
		set: function(path){
			return Rx.Observable.create(function(observer){

				observer.onNext(set(path));
				keyChangedSubject.onNext(path.key);
			})
		},
		get: function(path){
			return Rx.Observable.create(function(observer){
				observer.onNext(get(path));
				keyChangedSubject
				.filter(function(x) {return x === path.key})
				.subscribe(function(x){
					observer.onNext(get(path));
				});
			})
		},
		delete: function(path){
			return Rx.Observable.create(function(observer){
				observer.onNext(del(path));
				keyChangedSubject.onNext(path.key);
				observer.onCompleted();
			})
		}
	}
}