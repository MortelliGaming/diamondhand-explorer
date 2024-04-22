export function loadLocalAvatars() {
    try {
        const storedString = window.localStorage.getItem('validator-avatars');
        if(storedString) {
            return JSON.parse(window.localStorage.getItem('validator-avatars') || '') as Record<string, string>
        }
    } catch { /* */ }
    return {} as Record<string, string>
}

export async function keybase(identity: string) {
    return fetch(
        `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`,
    );
}
  
export const fetchAvatar: (identity: string) => Promise<string> =  (identity: string) => {
    // fetch avatar from keybase
    return new Promise<string>((resolve) => {
        keybase(identity)
        .then(async (d) => {
        const response = await d.json()
        if(response)
            if (Array.isArray(response.them) && response.them.length > 0) {
                const uri = String((response.them)[0]?.pictures?.primary?.url);
                return resolve(uri);
            } else {
            return resolve('')
            }
        })
        .catch(() => {
            // console.error(error); // uncomment this if you want the user to see if the avatar failed to load.
            return resolve('');
        });
    });
};
