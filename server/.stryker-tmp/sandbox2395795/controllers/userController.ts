// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import UserModel, { RatingModel, ReferralModel } from "../models/user/UserModel";
import UserDbInterface from "../models/dbInterface/userDbInterface";
import User, { NullUser, Rating, NullRating } from "../models/user/User";
export default class UserController {
  // need to make new function to take in a req and parse the req
  async handlePostRequest(user: User) {
    if (stryMutAct_9fa48("0")) {
      {}
    } else {
      stryCov_9fa48("0");
      const userCookie = await UserModel.findOne(stryMutAct_9fa48("1") ? {} : (stryCov_9fa48("1"), {
        cookieId: user[stryMutAct_9fa48("2") ? "" : (stryCov_9fa48("2"), "cookieId")]
      }));
      const userWallet = await UserModel.findOne(stryMutAct_9fa48("3") ? {} : (stryCov_9fa48("3"), {
        walletId: user[stryMutAct_9fa48("4") ? "" : (stryCov_9fa48("4"), "walletId")]
      }));
      let userCookieExists = Boolean(userCookie);
      let userWalletExists = Boolean(userWallet);
      switch (stryMutAct_9fa48("5") ? false : (stryCov_9fa48("5"), true)) {
        case stryMutAct_9fa48("9") ? !userCookieExists || userWalletExists : stryMutAct_9fa48("8") ? false : stryMutAct_9fa48("7") ? true : (stryCov_9fa48("7", "8", "9"), (stryMutAct_9fa48("10") ? userCookieExists : (stryCov_9fa48("10"), !userCookieExists)) && userWalletExists):
          if (stryMutAct_9fa48("6")) {} else {
            stryCov_9fa48("6");
            await this.updateUserCookies(user, userWallet);
            return stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), "reassigned user");
          }
        case stryMutAct_9fa48("15") ? userCookieExists || !userWalletExists : stryMutAct_9fa48("14") ? false : stryMutAct_9fa48("13") ? true : (stryCov_9fa48("13", "14", "15"), userCookieExists && (stryMutAct_9fa48("16") ? userWalletExists : (stryCov_9fa48("16"), !userWalletExists))):
          if (stryMutAct_9fa48("12")) {} else {
            stryCov_9fa48("12");
            return stryMutAct_9fa48("17") ? "" : (stryCov_9fa48("17"), "non existent wallet");
          }
        case stryMutAct_9fa48("21") ? userCookieExists || userWalletExists : stryMutAct_9fa48("20") ? false : stryMutAct_9fa48("19") ? true : (stryCov_9fa48("19", "20", "21"), userCookieExists && userWalletExists):
          if (stryMutAct_9fa48("18")) {} else {
            stryCov_9fa48("18");
            //
            return this.handleKnownUser(userCookie.id, userWallet.id);
          }
        default:
          if (stryMutAct_9fa48("22")) {} else {
            stryCov_9fa48("22");
            return await this.addUserToDatabase(user);
          }
      }
    }
  }

  /** Assumes that user does not exist in the database */
  private async addUserToDatabase(user: User) {
    if (stryMutAct_9fa48("23")) {
      {}
    } else {
      stryCov_9fa48("23");
      let userModel;
      user[stryMutAct_9fa48("24") ? "" : (stryCov_9fa48("24"), "referredUsers")] = user[stryMutAct_9fa48("25") ? "" : (stryCov_9fa48("25"), "numReferredUsers")];
      userModel = await new UserModel(user);
      await userModel.save();
      return stryMutAct_9fa48("26") ? "" : (stryCov_9fa48("26"), "added user to database");
    }
  }
  private async updateUserCookies(user: User, userWallet: any) {
    if (stryMutAct_9fa48("27")) {
      {}
    } else {
      stryCov_9fa48("27");
      userWallet.cookieId = user.cookieId;
      await UserModel.findOneAndUpdate(stryMutAct_9fa48("28") ? {} : (stryCov_9fa48("28"), {
        _id: userWallet.id
      }), userWallet, stryMutAct_9fa48("29") ? {} : (stryCov_9fa48("29"), {
        upsert: stryMutAct_9fa48("30") ? false : (stryCov_9fa48("30"), true)
      }));
    }
  }
  private handleKnownUser(userCookie: string, userWallet: string) {
    if (stryMutAct_9fa48("31")) {
      {}
    } else {
      stryCov_9fa48("31");
      if (stryMutAct_9fa48("34") ? userCookie == userWallet : stryMutAct_9fa48("33") ? false : stryMutAct_9fa48("32") ? true : (stryCov_9fa48("32", "33", "34"), userCookie != userWallet)) {
        if (stryMutAct_9fa48("35")) {
          {}
        } else {
          stryCov_9fa48("35");
          return stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), "wrong user-wallet pair");
        }
      }
      return stryMutAct_9fa48("37") ? "" : (stryCov_9fa48("37"), "correct user-wallet pair");
    }
  }
  async checkReferralCodeExists(referralCode: string) {
    if (stryMutAct_9fa48("38")) {
      {}
    } else {
      stryCov_9fa48("38");
      try {
        if (stryMutAct_9fa48("39")) {
          {}
        } else {
          stryCov_9fa48("39");
          const referralCodeExists = await UserModel.findOne(stryMutAct_9fa48("40") ? {} : (stryCov_9fa48("40"), {
            referralCode: referralCode
          }));
          return Boolean(referralCodeExists);
        }
      } catch (err) {
        if (stryMutAct_9fa48("41")) {
          {}
        } else {
          stryCov_9fa48("41");
          return stryMutAct_9fa48("42") ? true : (stryCov_9fa48("42"), false);
        }
      }
    }
  }

  /**
   * Adds rating to the database for a user. If user already has rating, 
   * update it instead. Returns a success/failure message
   * If user doesn't exist, then return error
   * @param userIdentity 
   * @param rating 
   */
  async upsertRating(userIdentity: object, rating: Rating, protocol: string) {
    if (stryMutAct_9fa48("43")) {
      {}
    } else {
      stryCov_9fa48("43");
      const user = await UserModel.findOne(stryMutAct_9fa48("44") ? {} : (stryCov_9fa48("44"), {
        cookieId: userIdentity[stryMutAct_9fa48("45") ? "" : (stryCov_9fa48("45"), "cookieId")],
        walletId: userIdentity[stryMutAct_9fa48("46") ? "" : (stryCov_9fa48("46"), "walletId")]
      }));
      if (stryMutAct_9fa48("49") ? false : stryMutAct_9fa48("48") ? true : stryMutAct_9fa48("47") ? user : (stryCov_9fa48("47", "48", "49"), !user)) return stryMutAct_9fa48("50") ? "" : (stryCov_9fa48("50"), 'user not found');
      const newRating = new RatingModel(stryMutAct_9fa48("51") ? {} : (stryCov_9fa48("51"), {
        scores: rating.scores,
        code: rating.code
      }));
      let ratingExists = Boolean(user.protocolRatings.get(protocol));
      if (stryMutAct_9fa48("53") ? false : stryMutAct_9fa48("52") ? true : (stryCov_9fa48("52", "53"), ratingExists)) {
        if (stryMutAct_9fa48("54")) {
          {}
        } else {
          stryCov_9fa48("54");
          return stryMutAct_9fa48("55") ? "" : (stryCov_9fa48("55"), "rating already submitted");
        }
      }
      user.protocolRatings.set(protocol, newRating);
      await user.save();
      return stryMutAct_9fa48("56") ? "" : (stryCov_9fa48("56"), "rating added");
    }
  }

  /**
   * Adds referee to the referrer's map of referred user
   * Should not allow users to add themselves as a referrer
   * @param referee 
   * @param referrerCode 
   */
  async addReferral(referee: User, referrerCode: string) {
    if (stryMutAct_9fa48("57")) {
      {}
    } else {
      stryCov_9fa48("57");
      const referrer = await UserModel.findOne(stryMutAct_9fa48("58") ? {} : (stryCov_9fa48("58"), {
        referralCode: referrerCode
      }));
      let status = this.checkReferralConditions(referee, User.createUserFromDocument(referrer));
      if (stryMutAct_9fa48("61") ? status != "valid" && referrer == null : stryMutAct_9fa48("60") ? false : stryMutAct_9fa48("59") ? true : (stryCov_9fa48("59", "60", "61"), (stryMutAct_9fa48("63") ? status == "valid" : stryMutAct_9fa48("62") ? false : (stryCov_9fa48("62", "63"), status != (stryMutAct_9fa48("64") ? "" : (stryCov_9fa48("64"), "valid")))) || (stryMutAct_9fa48("66") ? referrer != null : stryMutAct_9fa48("65") ? false : (stryCov_9fa48("65", "66"), referrer == null)))) {
        if (stryMutAct_9fa48("67")) {
          {}
        } else {
          stryCov_9fa48("67");
          return status;
        }
      }
      stryMutAct_9fa48("68") ? referrer.referredUsers -= 1 : (stryCov_9fa48("68"), referrer.referredUsers += 1);
      referrer.save();
      return stryMutAct_9fa48("69") ? "" : (stryCov_9fa48("69"), "successfully added/updated referral code");
    }
  }
  private checkReferralConditions(user: User, referrer: User) {
    if (stryMutAct_9fa48("70")) {
      {}
    } else {
      stryCov_9fa48("70");
      if (stryMutAct_9fa48("72") ? false : stryMutAct_9fa48("71") ? true : (stryCov_9fa48("71", "72"), referrer.isNull())) {
        if (stryMutAct_9fa48("73")) {
          {}
        } else {
          stryCov_9fa48("73");
          return stryMutAct_9fa48("74") ? "" : (stryCov_9fa48("74"), "user not found");
        }
      }
      if (stryMutAct_9fa48("77") ? referrer.walletId == user.walletId && referrer.cookieId == user.cookieId : stryMutAct_9fa48("76") ? false : stryMutAct_9fa48("75") ? true : (stryCov_9fa48("75", "76", "77"), (stryMutAct_9fa48("79") ? referrer.walletId != user.walletId : stryMutAct_9fa48("78") ? false : (stryCov_9fa48("78", "79"), referrer.walletId == user.walletId)) || (stryMutAct_9fa48("81") ? referrer.cookieId != user.cookieId : stryMutAct_9fa48("80") ? false : (stryCov_9fa48("80", "81"), referrer.cookieId == user.cookieId)))) {
        if (stryMutAct_9fa48("82")) {
          {}
        } else {
          stryCov_9fa48("82");
          return stryMutAct_9fa48("83") ? "" : (stryCov_9fa48("83"), "user submitted own referral code");
        }
      }
      return stryMutAct_9fa48("84") ? "" : (stryCov_9fa48("84"), "valid");
    }
  }

  /**
   * Gets a user based on userId. Returns user object and success message
   * if found and returns only message otherwise
   * @param cookieId 
   */
  async getUserInfo(cookieId: string): Promise<User> {
    if (stryMutAct_9fa48("85")) {
      {}
    } else {
      stryCov_9fa48("85");
      let user = await UserModel.findOne(stryMutAct_9fa48("86") ? {} : (stryCov_9fa48("86"), {
        cookieId: cookieId
      }));
      if (stryMutAct_9fa48("89") ? false : stryMutAct_9fa48("88") ? true : stryMutAct_9fa48("87") ? user : (stryCov_9fa48("87", "88", "89"), !user)) {
        if (stryMutAct_9fa48("90")) {
          {}
        } else {
          stryCov_9fa48("90");
          return new NullUser();
        }
      }
      let ret = User.createUserFromDocument(user);
      return ret;
    }
  }

  /**
   * Gets user rating from database. Returns 
   * nullRating user or rating isn't found
   */
  async getUserRating(cookieId: string, walletId: string, protocolName: string): Promise<Rating> {
    if (stryMutAct_9fa48("91")) {
      {}
    } else {
      stryCov_9fa48("91");
      const user = await UserModel.findOne(stryMutAct_9fa48("92") ? {} : (stryCov_9fa48("92"), {
        cookieId: cookieId,
        walletId: walletId
      }));
      if (stryMutAct_9fa48("95") ? false : stryMutAct_9fa48("94") ? true : stryMutAct_9fa48("93") ? user : (stryCov_9fa48("93", "94", "95"), !user)) {
        if (stryMutAct_9fa48("96")) {
          {}
        } else {
          stryCov_9fa48("96");
          return new NullRating();
        }
      }
      const rating = user.protocolRatings.get(protocolName);
      if (stryMutAct_9fa48("99") ? rating != null : stryMutAct_9fa48("98") ? false : stryMutAct_9fa48("97") ? true : (stryCov_9fa48("97", "98", "99"), rating == null)) return new NullRating();
      return Rating.fromIRating(rating);
    }
  }
}

/** @returns a random alphanumeric code with length codeLength */
function generateCode(codeLength = 8): string {
  if (stryMutAct_9fa48("100")) {
    {}
  } else {
    stryCov_9fa48("100");
    const str = stryMutAct_9fa48("101") ? "" : (stryCov_9fa48("101"), '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
    let code = stryMutAct_9fa48("102") ? "Stryker was here!" : (stryCov_9fa48("102"), "");
    for (let i = 0; stryMutAct_9fa48("105") ? i >= codeLength : stryMutAct_9fa48("104") ? i <= codeLength : stryMutAct_9fa48("103") ? false : (stryCov_9fa48("103", "104", "105"), i < codeLength); stryMutAct_9fa48("106") ? i-- : (stryCov_9fa48("106"), i++)) {
      if (stryMutAct_9fa48("107")) {
        {}
      } else {
        stryCov_9fa48("107");
        stryMutAct_9fa48("108") ? code -= str.charAt(Math.floor(Math.random() * (str.length + 1))) : (stryCov_9fa48("108"), code += stryMutAct_9fa48("109") ? str : (stryCov_9fa48("109"), str.charAt(Math.floor(stryMutAct_9fa48("110") ? Math.random() / (str.length + 1) : (stryCov_9fa48("110"), Math.random() * (stryMutAct_9fa48("111") ? str.length - 1 : (stryCov_9fa48("111"), str.length + 1)))))));
      }
    }
    return code;
  }
}