import React, {Component} from 'react';

class HomeComp extends Component
{
    render()
    {
        var container = {
            width: "800px",
            height: "700px",
            position: "relative",
            borderRadius: "15px",
        };

        var headerContainer = {
            padding: "0px 20px 20px 20px"
        };
         var leftCont = {
             position: "absolute",
             top: "16%",
             left: "0%",
            width: "580px",
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
            margin: "8px 0"
        }

        return(
            <div style={container}>
                <div style={headerContainer}>
                    <h3>Welcome to MovieMania!</h3>
                    <hr/>
                </div>
                <div className="alignright">
                    <img style={myImg} src="https://scontent.fhyd1-2.fna.fbcdn.net/v/t1.0-9/40006407_1913132192109890_7333126001825677312_n.jpg?_nc_cat=0&oh=5a7f399b71f20025139a3dd6a5f7264c&oe=5C3358E5" width="150px" height="150px"/>
                    <br/>
                    <p ><a style={ancor} href="https://www.linkedin.com/in/azhar-talha-syed"><i>~Azhar Talha Syed~</i></a></p>
                </div>
                <div style={leftCont}>
                <ul>
                    <li style={my_margin}>Hello I am <a style={ancor} href="https://www.linkedin.com/in/azhar-talha-syed">Azhar</a>, the founder and developer of MovieMania. 
                    </li><li style={my_margin}><p>MovieMania is a clone of IMDB where
                    people can find all the data related to movies and review them.
                    </p></li><li style={my_margin}> <p>MovieMania is a single page full stack webapp built using
                    React.js and django-rest framework.</p> 
                    </li><li style={my_margin}><p>There are three types of users in MovieMaina: Admin, staff and a general user. Each having a specific set of permissions to access pages of the webapp. Which means a person without a permission for a page will not be given an access.</p></li><li>
                    <p> A staff user will have permissions to add movies/celebs, update movies/celebs and add celebs/genres to movie etc. Basically can perform all
                    the CRUD operations. 
                    If you want to have the 
                    staff permissions please message me your username of the account that you have created in moviemania to my <a style={ancor} href="https://www.linkedin.com/in/azhar-talha-syed">linkedIn</a>.</p>
                    </li><li style={my_margin}><p>As general user he/she will be able to update the profile, change password and add reviews to the movies, review section will be found at the bottom of every movie page. 
                    </p></li><li style={my_margin}><p>The main agenda of building this application was to develop a full stack
                    webapp by myself and get proficient at the mentioned frameworks.</p></li><li style={my_margin}><p> Here is the link to the <a style={ancor} href="https://github.com/azhartalha/Movie-Mania">GitHub repo</a> of the website
                    walk throught the code and use the website if you are intrested. :)
                </p ></li>
                </ul>
                </div>
            </div>
        );
    }
}

export default HomeComp;