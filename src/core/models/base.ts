const baseSchema = {
    live: { type: Boolean, private: true },
    created: { type: Date, default: Date.now },
    modified: Date,
};

export default baseSchema;
