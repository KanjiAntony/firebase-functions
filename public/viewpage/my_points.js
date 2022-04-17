import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { getAccountPoints } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { currentUser } from '../controller/firebase_auth.js';


export function addEventListeners() {
    MENU.MyPoints.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.MY_POINTS);
        const label = Util.disableButton(MENU.MyPoints);
        await my_points_page();
        Util.enableButton(MENU.MyPoints, label);
    });
}
export async function my_points_page() {
    let html = '<h1>My wallet</h1>';
    let points;
    try {
        points = await getAccountPoints(currentUser.uid);

        html += `
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">My points</th>
                    <th scope="col">${points}</th>
                    </tr>
                </thead>
                <tbody>

                    `;
        


        html += '<tbody></table>';

    } catch (e) {
        if (DEV) console.log(e);
    }

    
    root.innerHTML = html;
    



}

