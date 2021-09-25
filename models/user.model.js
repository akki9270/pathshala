const uuid = require("uuid");
const crypto = require("crypto");

module.exports = function (Sequelize, Types) {
  let User = Sequelize.define(
    "User",
    {
      id: {
        type: Types.INTEGER,
        // defaultValue: Types.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      first_name: { type: Types.STRING },
      middle_name: { type: Types.STRING },
      last_name: { type: Types.STRING },
      profile_image: { type: Types.STRING },
      display_name: { type: Types.STRING },
      date_of_birth: { type: Types.DATE },
      gender: { type: Types.ENUM('Male', 'Female') },
      email: { type: Types.STRING, unique: false },
      barcode_url: { type: Types.STRING },
      role: { type: Types.ENUM('Admin', 'Teacher', 'Student') },
      level: { type: Types.ENUM('Beginner', 'Intermediate', 'Expert') },
      telephone: { type: Types.BIGINT },
      mobile: { type: Types.STRING },
      street: { type: Types.STRING },
      house_number: { type: Types.INTEGER },
      area_code: { type: Types.INTEGER },
      city: { type: Types.STRING },
      country: { type: Types.STRING },
      is_active: { type: Types.TINYINT, defaultValue: '1' },
      // password: {
      //   type: Types.VIRTUAL,
      //   set(password) {
      //     if (!password) {
      //       throw new Error("Password must be provided");
      //     }
      //     let _password = password;
      //     let salt = uuid.v1();
      //     this._password = _password;
      //     this.salt = salt;
      //     let hashed_password = this.encryptPassword(password);
      //     this.hashed_password = hashed_password;
      //   },
      //   get() {
      //     return User._password;
      //   },
      //   // allowNull: false,
      //   validate: {
      //     isLongEnough: function (val) {
      //       console.log(' val ************* ', val);
      //       if (val.length < 7) {
      //         throw new Error("Please choose a longer password")
      //       }
      //     }
      //   }
      // },
      // salt: Types.STRING,
      // hashed_password: { type: Types.STRING },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      tableName: "user",
      modelName: "User",
      // instanceMethods: {
      //   encryptPassword: function (password) {
      //     console.log('class Methods ', password, this)
      //   }
      // }
    }
  );

  // User.prototype.encryptPassword = function (password) {
  //   if (!password) {
  //     return "";
  //   }
  //   try {
  //     let hashed = crypto
  //       .createHmac("sha1", this.salt)
  //       .update(password)
  //       .digest("hex");
  //     console.log('hashed ', hashed);
  //     return hashed;
  //   } catch (error) {
  //     return "";
  //   }
  // }

  User.prototype.isAuthenticate = function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  }

  return User;
};
