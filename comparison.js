document.getElementById('process-btn').addEventListener('click', processFiles);
document.getElementById('h2').style.display = 'none';

function processFiles() {
    const followersFile = document.getElementById('followers-file').files[0];
    const followingFile = document.getElementById('following-file').files[0];

    if (!followersFile || !followingFile) {
        alert("Please upload both JSON files.");
        return;
    }

    // Show loading message
    document.getElementById('loading').style.display = 'block';

    // Hide input fields, labels, and button
    document.getElementById('followers-file').style.display = 'none';
    document.getElementById('following-file').style.display = 'none';
    document.getElementById('process-btn').style.display = 'none';
    document.getElementById('h2').style.display = 'block';
    document.querySelector('label[for="followers-file"]').style.display = 'none';
    document.querySelector('label[for="following-file"]').style.display = 'none';

    const followersReader = new FileReader();
    const followingReader = new FileReader();

    followersReader.onload = function(e) {
        const followersData = JSON.parse(e.target.result);
        followingReader.onload = function(e) {
            const followingData = JSON.parse(e.target.result);
            compareData(followersData, followingData);
        };
        followingReader.readAsText(followingFile);
    };
    
    followersReader.readAsText(followersFile);
}

function compareData(followers, following) {
    const followerUsernames = followers.map(follower => follower.string_list_data[0].value);
    const followingUsers = following.relationships_following.map(following => following.string_list_data[0]);

    const noFollowBack = followingUsers.filter(user => !followerUsernames.includes(user.value));

    const noFollowBackList = document.getElementById('no-followback-list');
    noFollowBackList.innerHTML = ''; // Clear previous results

    // Hide loading message
    document.getElementById('loading').style.display = 'none';

    if (noFollowBack.length > 0) {
        noFollowBack.forEach(user => {
            const card = document.createElement('div');
            card.classList.add('profile-card');

            // Create image element for Instagram profile picture
            const img = document.createElement('img');
            img.src = `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100)}.png`; 
            img.alt = `${user.value}'s profile picture`;

            // Create anchor element for Instagram profile link
            const usernameLink = document.createElement('a');
            usernameLink.href = user.href;
            usernameLink.textContent = user.value;
            usernameLink.target = "_blank";

            // Create timestamp element
            const timestamp = document.createElement('div');
            const date = new Date(user.timestamp * 1000);
            const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            timeZoneName: 'short' 
            };
            timestamp.textContent = `Followed: ${date.toLocaleDateString(undefined, options)}`;
            timestamp.classList.add('timestamp');

            card.appendChild(img);
            card.appendChild(usernameLink);
            card.appendChild(timestamp);

            noFollowBackList.appendChild(card);
        });
    } else {
        noFollowBackList.innerHTML = '<div class="no-results">Everyone follows you back!</div>';
    }
}
