document.addEventListener('DOMContentLoaded',function(){
    const searchButton = document.getElementById("search-bar");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

   
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const url = `https://leetcode-api-faisalshohag.vercel.app/${username}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }

            const data = await response.json();
            console.log("Fetched data:", data);
            displayUserData(data);
        } catch (error) {
            statsContainer.innerHTML = `<p style="color:red">${error.message}</p>`;
            console.error("Error:", error);
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const percent = total > 0 ? (solved / total) * 100 : 0;
        circle.style.setProperty("--progress-degree", `${percent}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(data) {
        const solvedEasy = data.easySolved;
        const solvedMedium = data.mediumSolved;
        const solvedHard = data.hardSolved;
        const totalSolved = data.totalSolved;

        const totalEasy = data.totalEasy || solvedEasy; // fallback if not available
        const totalMedium = data.totalMedium || solvedMedium;
        const totalHard = data.totalHard || solvedHard;

        updateProgress(solvedEasy, totalEasy, easyLabel, easyProgressCircle);
        updateProgress(solvedMedium, totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHard, totalHard, hardLabel, hardProgressCircle);

        const cardsData = [
            { label: "Total Problems Solved", value: totalSolved },
            { label: "Easy Problems Solved", value: solvedEasy },
            { label: "Medium Problems Solved", value: solvedMedium },
            { label: "Hard Problems Solved", value: solvedHard },
            { label: "Ranking", value: data.ranking },
            { label: "Contribution Points", value: data.contributionPoint }
        ];

        cardStatsContainer.innerHTML = cardsData
            .map(
                (data) => `
            <div class="card">
                <h4>${data.label}</h4>
                <p>${data.value}</p>
            </div>`
            )
            .join("");
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        console.log("Username:", username);
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
