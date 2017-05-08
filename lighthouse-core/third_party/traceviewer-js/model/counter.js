"use strict";require("../base/guid.js");require("../base/range.js");require("./counter_series.js");require("./event_container.js");'use strict';global.tr.exportTo('tr.model',function(){function Counter(parent,id,category,name){tr.model.EventContainer.call(this);this.parent_=parent;this.id_=id;this.category_=category||'';this.name_=name;this.series_=[];this.totals=[];}Counter.prototype={__proto__:tr.model.EventContainer.prototype,get parent(){return this.parent_;},get id(){return this.id_;},get category(){return this.category_;},get name(){return this.name_;},childEvents:function*(){},childEventContainers:function*(){yield*this.series;},set timestamps(arg){throw new Error('Bad counter API. No cookie.');},set seriesNames(arg){throw new Error('Bad counter API. No cookie.');},set seriesColors(arg){throw new Error('Bad counter API. No cookie.');},set samples(arg){throw new Error('Bad counter API. No cookie.');},addSeries:function(series){series.counter=this;series.seriesIndex=this.series_.length;this.series_.push(series);return series;},getSeries:function(idx){return this.series_[idx];},get series(){return this.series_;},get numSeries(){return this.series_.length;},get numSamples(){if(this.series_.length===0)return 0;return this.series_[0].length;},get timestamps(){if(this.series_.length===0)return[];return this.series_[0].timestamps;},getSampleStatistics:function(sampleIndices){sampleIndices.sort();var ret=[];this.series_.forEach(function(series){ret.push(series.getStatistics(sampleIndices));});return ret;},shiftTimestampsForward:function(amount){for(var i=0;i<this.series_.length;++i)this.series_[i].shiftTimestampsForward(amount);},updateBounds:function(){this.totals=[];this.maxTotal=0;this.bounds.reset();if(this.series_.length===0)return;var firstSeries=this.series_[0];var lastSeries=this.series_[this.series_.length-1];this.bounds.addValue(firstSeries.getTimestamp(0));this.bounds.addValue(lastSeries.getTimestamp(lastSeries.length-1));var numSeries=this.numSeries;this.maxTotal=-Infinity;for(var i=0;i<firstSeries.length;++i){var total=0;this.series_.forEach(function(series){total+=series.getSample(i).value;this.totals.push(total);}.bind(this));this.maxTotal=Math.max(total,this.maxTotal);}}};Counter.compare=function(x,y){var tmp=x.parent.compareTo(y);if(tmp!=0)return tmp;var tmp=x.name.localeCompare(y.name);if(tmp==0)return x.tid-y.tid;return tmp;};return{Counter:Counter};});