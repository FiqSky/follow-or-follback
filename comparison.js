document.getElementById('process-btn').addEventListener('click', processZipFile);
document.getElementById('h2').style.display = 'none';

function processZipFile() {
    const zipFile = document.getElementById('zip-file').files[0];

    if (!zipFile) {
        alert("Please upload a ZIP file.");
        return;
    }

    // Show loading message
    document.getElementById('loading').style.display = 'block';

    // Hide input fields, labels, and button
    document.getElementById('zip-file').style.display = 'none';
    document.getElementById('process-btn').style.display = 'none';
    document.querySelector('label[for="zip-file"]').style.display = 'none';

    const zip = new JSZip();

    // Read the zip file
    zip.loadAsync(zipFile).then(function(zipContent) {
        // Extract files from 'connections/followers_and_following/' folder
        const followersFile = zipContent.file("connections/followers_and_following/followers_1.json");
        const followingFile = zipContent.file("connections/followers_and_following/following.json");

        if (followersFile && followingFile) {
            // Read followers_1.json
            followersFile.async("string").then(function(followersData) {
                // Read following.json after followers_1.json is processed
                followingFile.async("string").then(function(followingData) {
                    compareData(JSON.parse(followersData), JSON.parse(followingData));

                    // Show the h2 element after processing is complete and hide the loading spinner
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('h2').style.display = 'block';
                });
            });
        } else {
            alert("Required JSON files not found in the ZIP.");
            document.getElementById('loading').style.display = 'none';
            document.getElementById('zip-file').style.display = 'block';
            document.getElementById('process-btn').style.display = 'block';
            document.getElementById('h2').style.display = 'none';
            document.querySelector('label[for="zip-file"]').style.display = 'block';
        }
    });
}

function compareData(followers, following) {
    const followerUsernames = followers.map(follower => follower.string_list_data[0].value);
    const followingUsers = following.relationships_following.map(following => following.string_list_data[0]);

    const noFollowBack = followingUsers.filter(user => !followerUsernames.includes(user.value));

    const noFollowBackList = document.getElementById('no-followback-list');
    noFollowBackList.innerHTML = ''; // Bersihkan hasil sebelumnya

    // Hilangkan loading
    document.getElementById('loading').style.display = 'none';

    if (noFollowBack.length > 0) {
        noFollowBack.forEach(user => {
            const card = document.createElement('div');
            card.classList.add('profile-card', 'fade-in');  // Tambahkan kelas animasi

            // Buat elemen gambar profil
            const img = document.createElement('img');
            img.src = `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100)}.png`;
            img.alt = `${user.value}'s profile picture`;

            // Buat tautan username
            const usernameLink = document.createElement('a');
            usernameLink.href = user.href;
            usernameLink.textContent = user.value;
            usernameLink.target = "_blank";

            // Buat elemen timestamp
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
        noFollowBackList.innerHTML = '<div class="no-results fade-in">Everyone follows you back!</div>';
    }
}
