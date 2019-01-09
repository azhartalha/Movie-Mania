import React, {Component} from 'react';

class HomeComp extends Component
{
    render()
    {
        var container = {
            width: "800px",
            height: "610px",
            position: "relative",
            borderRadius: "15px",
        };

        var headerContainer = {
            padding: "0px 20px 20px 20px"
        };
         var leftCont = {
            top: "16%",
            width: "700px",
            fontSize: "15px",
            textAlign: "left"
        }
        var ancor = {
            color: "blue"
        }
        
        var myImg = {
            borderRadius: "50%",
            margin: "10px"
        }

        var my_margin = {
            textAlign: "justify",
        }

        return(
            <div style={container}>
                <div style={headerContainer}>
                    <h3>Welcome to MovieMania!</h3>
                    <hr/>
                </div>
                <div style={leftCont}>
                <ul >
                    <li style={my_margin}><p>Hello I am <a style={ancor} href="https://www.linkedin.com/in/azhar-talha-syed">Azhar</a>, the founder and developer of MovieMania. 
                    </p></li><li style={my_margin}> <p>MovieMania is a single page full stack webapp built using
                    React.js and django-rest framework.</p> 
                    </li>
                    <li style={my_margin}><p>This is a clone of IMDB where
                    people can find all the data related to movies and review them.
                    </p></li>
                    <li style={my_margin}><p>There are three classes of users in MovieMaina: Admin, staff, and a general user. Each having a specific set of permissions to access pages of the webapp. There are three classes of users in MovieMaina: Admin, staff, and a general user. Each having a specific set of permissions required to access corresponding pages of the web app. A user without a mandated permit for a page will not have access to the page.</p></li>
                    <li>
                    <p>A Staff user has permissions to add movies/celebs, update movies/celebs, add celebs/genres to a movie, etc. Basically can perform all the CRUD operations. If you wish to have the staff permissions, please message the username of the account that you have created to my <a style={ancor} href="https://www.linkedin.com/in/azhar-talha-syed">LinkedIn</a>.</p>
                    </li><li style={my_margin}><p>As general user he/she will be able to update the profile, change password, and add reviews to the movies. Review section will be found at the bottom of every movie page. 
                    </p></li><li style={my_margin}><p>The agenda of building this application was to develop an extensive full stack
                    webapp by myself and get proficient at the mentioned frameworks.</p></li><li style={my_margin}><p> Here is the link to the <a style={ancor} href="https://github.com/azhartalha/Movie-Mania">GitHub repo</a> of the website, 
                    walk throught the code and use the website if you are intrested. :)
                </p ></li>
                </ul>
                </div>
            </div>
        );
    }
}

export default HomeComp;