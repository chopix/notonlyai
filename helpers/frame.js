const frame = {
    getKey(obj, prop, val) {
        var keys = [];

        for (var key in obj) {
            if (obj[key].hasOwnProperty(prop) && obj[key][prop] === val) {
                keys.push(key);
            }
        }

        return keys;
    },
    getUnique_id(length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    isNum(value) {
        return /^-?\d+$/.test(value);
    },
    randomIntFromInterval(min, max) {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    decompress(string) {
        var newString = "",
            char,
            codeStr,
            firstCharCode,
            lastCharCode;

        for (var i = 0; i < string.length; i++) {
            char = string.charCodeAt(i);
            if (char > 132) {
                codeStr = char.toString(10);

                // You take the first part of the compressed char code, it's your first letter
                firstCharCode = parseInt(codeStr.substring(0, codeStr.length - 2), 10);

                // For the second one you need to add 31 back.
                lastCharCode =
                    parseInt(codeStr.substring(codeStr.length - 2, codeStr.length), 10) +
                    31;

                // You put back the 2 characters you had originally
                newString +=
                    String.fromCharCode(firstCharCode) +
                    String.fromCharCode(lastCharCode);
            } else {
                newString += string.charAt(i);
            }
        }
        return newString;
    },
    star(string, token) {
        return string.replace(new RegExp(token, "g"), "*" + token + "*");
    },
    sklonenie: (number, txt, cases = [2, 0, 1, 1, 1, 2]) =>
        txt[
            number % 100 > 4 && number % 100 < 20
                ? 2
                : cases[number % 10 < 5 ? number % 10 : 5]
            ],
    sub_calc(date1, date2) {
        if (date1 > date2) {
            // swap
            var result = interval(date2, date1);
            result.years = -result.years;
            result.months = -result.months;
            result.days = -result.days;
            result.hours = -result.hours;
            return result;
        }
        result = {
            years: date2.getYear() - date1.getYear(),
            months: date2.getMonth() - date1.getMonth(),
            days: date2.getDate() - date1.getDate(),
            hours: date2.getHours() - date1.getHours(),
        };
        if (result.hours < 0) {
            result.days--;
            result.hours += 24;
        }
        if (result.days < 0) {
            result.months--;
            // days = days left in date1's month,
            //   plus days that have passed in date2's month
            var copy1 = new Date(date1.getTime());
            copy1.setDate(32);
            result.days = 32 - date1.getDate() - copy1.getDate() + date2.getDate();
        }
        if (result.months < 0) {
            result.years--;
            result.months += 12;
        }
        return result;
    },
};

export default frame;
