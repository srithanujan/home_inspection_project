const authenticationModel = require('../models/authenticationModel');
const key = '123456789trytryrtyr';
const encryptor = require('simple-encryptor')(key);

const createAuthenticationControllerFn = async (req, res) => {
  try {
    const status = await createInspectorDBService(req.body);
    if (status) {
      res.send({ "status": true, "message": "Inspector created successfully" });
    } else {
      res.send({ "status": false, "message": "Error creating Inspector" });
    }
  } catch (err) {
    res.send({ "status": false, "message": "Internal Server Error" });
  }
};

const loginInspectorControllerFn = async (req, res) => {
  try {
    const result = await loginInspectorDBService(req.body);
    if (result.status) {
      res.send({ "status": true, "message": result.msg });
    } else {
      res.send({ "status": false, "message": result.msg });
    }
  } catch (error) {
    res.send({ "status": false, "message": "Internal Server Error" });
  }
};

const createInspectorDBService = async (inspectorDetails) => {
  try {
    const authenticationModelData = new authenticationModel();
    authenticationModelData.firstname = inspectorDetails.firstname;
    authenticationModelData.lastname = inspectorDetails.lastname;
    authenticationModelData.email = inspectorDetails.email;
    authenticationModelData.password = encryptor.encrypt(inspectorDetails.password);
    await authenticationModelData.save();
    return true;
  } catch (error) {
    return false;
  }
};

const loginInspectorDBService = async (inspectorDetails) => {
  try {
    const result = await authenticationModel.findOne({ email: inspectorDetails.email });
    if (result) {
      const decrypted = encryptor.decrypt(result.password);
      if (decrypted === inspectorDetails.password) {
        return { status: true, msg: "Inspector Validated Successfully" };
      } else {
        return { status: false, msg: "Inspector Validation failed" };
      }
    } else {
      return { status: false, msg: "Inspector Error Details" };
    }
  } catch (error) {
    return { status: false, msg: "Invalid Data" };
  }
};

module.exports = { createAuthenticationControllerFn, loginInspectorControllerFn };