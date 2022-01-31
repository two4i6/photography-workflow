export default function TestForm():any {
    const handlesubmit = async (e:any) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const formData = Object.fromEntries(form.entries()); 

        console.log(formData);
        
        const res = await fetch('/api/test', {
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
    
        const result = await res.json();
        console.log(result);
    }

    
    return (
        <form>
            <input type="text" name="name" placeholder="name" />
            <input type="text" name="age" placeholder="age" />
            <textarea name='description' placeholder='description' />
            <button type="submit" onClick={handlesubmit} >Submit</button>
        </form>
    )
}