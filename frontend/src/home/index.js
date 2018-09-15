import React, {Component} from 'react';

class HomeComp extends Component
{
    render()
    {
        var container = {
            width: "800px",
            height: "500px",
            position: "relative"
        };

        var headerContainer = {
            padding: "0px 20px 20px 20px"
        };
         var leftCont = {
             position: "absolute",
             top: "16%",
             left: "0%",
            width: "560px",
            fontSize: "15px",
            textAlign: "left"
        }
        var ancor = {
            color: "red"
        }
        
        var myImg = {
            borderRadius: "50%",
            marginBottom: "10px"
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
                    </li><li style={my_margin}>MovieMania is a clone of IMDB where
                    people can find all the data related to movies and review them.
                    </li><li style={my_margin}> MovieMania is a single page full stack webapp buit using
                    React.js and django-rest framework. 
                    </li><li style={my_margin}>There are three types of users in MovieMaina. Admin, staff and a general user. If you want to have the 
                    staff permissions please message me your username of the account that you have created in moviemania to my <a style={ancor} href="https://www.linkedin.com/in/azhar-talha-syed">linkedIn</a>.</li><li>
                         You will be able to add movies/celebs, update movies/celebs and add celebs/genres to movie etc. Basically all
                    the CURD operations. </li><li style={my_margin}>As general user he/she will only be able to add reviews to the movies, review section will be found at the bottom of every movie page. 
                    </li><li style={my_margin}>The main agenda of building this application was to develop a full stack
                    webapp by myself and get proficient at the mentioned frameworks.</li><li style={my_margin}> Here is the link to the <a style={ancor} href="https://github.com/azhartalha/Movie-Mania">GitHub repo</a> of the website
                    walk throught the code and use the website if you are intrested. :)
                </li>
                </ul>
                </div>
            </div>
        );
    }
}

export default HomeComp;