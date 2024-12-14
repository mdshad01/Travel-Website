module.exports = (fe) => {
	return (req, res, next) => {
		fe(req, res, next).catch(next);
	};
};
