const supabase = require("./client");

// Signup functions

async function getUserByUsername(username) {
	const { data, error } = await supabase
		.from("users")
		.select("username")
		.eq("username", username)
		.single();

	if (error) {
		console.error("Error finding user by username:", error);
		return false;
	}
	return data;
}

async function getUserById(userID) {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", userID)
		.single();

	if (error) {
		console.error("Error finding user:", error);
		return false;
	}
	return data;
}

async function insertSignUpData(fName, lName, username, password, profilePic) {
	const { data, error } = await supabase
		.from("users")
		.insert([
			{
				first_name: fName,
				last_name: lName,
				username: username,
				password: password,
				profile_picture_url: profilePic,
			},
		])
		.select("id");

	if (error) {
		console.error("Error signing up:", error);
		return null;
	}

	return data[0];
}

// Login - Increment functions

async function incrementCount(id, column) {
	const { error } = await supabase.rpc("increment_count", {
		column_name: column,
		x: 1,
		row_id: id,
	});

	if (error) {
		console.error(`Error updating ${column}:`, error);
		return false;
	}
	return true;
}

async function incrementLoginCount(id) {
	return await incrementCount(id, "login_count");
}

async function incrementVisitCount(id) {
	return await incrementCount(id, "visit_count");
}

// Membership functions

async function checkMembership(id) {
	const { data, error } = await supabase
		.from("users")
		.select("membership")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error:", error);
		return false;
	}

	const currentMembership = data.membership;
	const newMembership = !currentMembership;

	await changeMembership(newMembership, id);
}

async function changeMembership(newMembership, id) {
	const { error } = await supabase
		.from("users")
		.update({ membership: newMembership })
		.eq("id", id);

	if (error) {
		console.error("Error updating the membership:", error);
		return false;
	}

	return true;
}

// Letter functions

async function getLetters(sort, offset, limit) {
	const { data, error } = await supabase
		.from("letters")
		.select(
			`*, users (
      first_name, 
      profile_picture_url
    )`,
		)
		.order("timestamp", { ascending: sort })
		.range(offset, offset + limit - 1);

	if (error) {
		console.error("Error fetching letters:", error);
		return [];
	}

	return data;
}

async function insertLetter(title, message, userID) {
	const { error } = await supabase
		.from("letters")
		.insert([{ title: title, message: message, user_id: userID }]);

	if (error) {
		console.error("Error inserting message:", error);
		return false;
	}

	return true;
}

async function getUserLetters(userID, sort, offset, limit) {
	const { data, error } = await supabase
		.from("letters")
		.select(
			`*, users (
      first_name, 
      profile_picture_url
    )`,
		)
		.eq("user_id", userID)
		.order("timestamp", { ascending: sort })
		.range(offset, offset + limit - 1);

	if (error) {
		console.error("Error fetching your letters:", error);
		return [];
	}

	return data;
}

async function deleteLetter(id) {
	const { error } = await supabase.from("letters").delete().eq("id", id);

	if (error) {
		console.error("Error deleting message:", error);
	}
}

async function updateLetter(id, title, message) {
	const { error } = await supabase
		.from("letters")
		.update({
			title: title,
			message: message,
			edit_timestamp: new Date().toISOString(),
		})
		.eq("id", id);

	if (error) {
		console.error("Error updating letter:", error);
	}
}

async function getLettersCount() {
	try {
		const { count } = await supabase
			.from("letters")
			.select("*", { count: "exact", head: true });

		return count;
	} catch (error) {
		console.error("Error getting letters count:", error);
		throw error;
	}
}

async function getUserLettersCount(userID) {
	try {
		const { count } = await supabase
			.from("letters")
			.select("*", { count: "exact", head: true })
			.eq("user_id", userID);

		return count;
	} catch (error) {
		console.error("Error getting user letters count:", error);
		throw error;
	}
}

// User Info Functions

async function updateUserInfo(id, userInfo) {
	const { error } = await supabase.from("users").update(userInfo).eq("id", id);

	if (error) {
		console.error("Error updating user info:", error);
	}
}

// Recover Password functions

async function updatePassword(username, lastName, password) {
	const { error } = await supabase
		.from("users")
		.update({ password: password })
		.eq("username", username)
		.ilike("last_name", lastName);

	if (error) {
		console.error("Error updating password:", error);
		return false;
	}
	console.log("Password updated successfully");
	return true;
}

async function validateLastNameViaUsername(lastName, username) {
	const { data, error } = await supabase
		.from("users")
		.select("last_name")
		.eq("username", username)
		.ilike("last_name", lastName)
		.single();

	if (error || !data) {
		return false;
	}

	return true;
}

module.exports = {
	getUserByUsername,
	getUserById,
	insertSignUpData,
	incrementLoginCount,
	incrementVisitCount,
	checkMembership,
	getUserLetters,
	insertLetter,
	getLetters,
	deleteLetter,
	updateLetter,
	getLettersCount,
	getUserLettersCount,
	updateUserInfo,
	updatePassword,
	validateLastNameViaUsername,
};
