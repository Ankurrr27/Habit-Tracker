import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9_]+$/,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false, // ✅ GOOGLE USERS OK
      select: false,
    },

    provider: {
  type: String,
  enum: ["local", "google"],
  default: "local",
},


    avatar: {
      type: String,
      default: "",
    },

    externalProfiles: {
      github: {
        type: String,
        trim: true,
        default: "",
      },
      leetcode: {
        type: String,
        trim: true,
        default: "",
      },
      codeforces: {
        type: String,
        trim: true,
        default: "",
      },
      codechef: {
        type: String,
        trim: true,
        default: "",
      },
    },

    profilePublic: {
      type: Boolean,
      default: false,
    },

    credibilityScore: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        ret.externalProfiles = ret.externalProfiles || {
          github: "",
          leetcode: "",
          codeforces: "",
          codechef: "",
        };
      },
    },
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
