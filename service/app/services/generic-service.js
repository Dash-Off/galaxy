/**
 * Creates a new model entity in the database
 * @param {Object} center 
 * @returns {Promise}
 */
const save = (Model) => async(modelData) => {
  const model = new Model(modelData);
  return model.save();

}


/**
 * 
 * @param {String} id 
 * @returns {Object}
 */
const deleteById = (Model) =>  async(id) => {
  const model = await Model.findOneAndDelete({_id: id}).exec();
  return model;
}

/**
 * 
 * @param {String} id - Identifier of Model
 * @param {Object} update - Object of new values to be updated
 * @returns {Object}
 */
const updateById = (Model) => async(id, update) => {
  const model = await Model.findOneAndUpdate({_id: id}, update, {
    new: true
  }).exec();
  return model;
};


/**
 * 
 * @param {String} id 
 * @returns {Promise}
 */
const find = (Model) => async (id) => {
  const model = Model.findById(id).exec();
  return model;
}



export default (Model) => ({
  updateById: updateById(Model),
  deleteById: deleteById(Model),
  save: save(Model),
  find: find(Model),
});