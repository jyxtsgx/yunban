'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;  // ObjectId是mongoose中重要的引用字段类型，在Schema中默认配置了该属性，索引也是利用组件进行

var MusicCommentSchema = new Schema({
  music: {type: ObjectId, ref: 'Music'}, //当前要评论的音乐,ref指向数据库的模型
  from: {type: ObjectId, ref: 'User'}, //第一级的评论者
  reply: [{
    from: {type: ObjectId, ref: 'User'},//第二级谁回复谁的前面那个谁
    to: {type: ObjectId, ref: 'User'}, //后面那个谁
    content: String,
    meta: {
      createAt: {
        type: Date,
        default: Date.now()
      }
    }
  }],
  content: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

// 模式保存前执行下面函数,如果当前数据是新创建，则创建时间和更新时间都是当前时间，否则更新时间是当前时间
MusicCommentSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else{
    this.meta.updateAt = Date.now();
  }

  next();
});

// 静态方法不会与数据库直接交互，需要经过模型编译实例化后才会具有该方法
MusicCommentSchema.statics = {
  fetch: function(cb) {
    return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb);
  },
  findById: function(id, cb) {
    return this
        .findOne({_id: id})
        .exec(cb);
  }
};

module.exports = MusicCommentSchema;












